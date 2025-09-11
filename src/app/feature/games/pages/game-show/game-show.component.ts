import { DatePipe, JsonPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    signal,
    type OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '@app/core/auth/models/auth.model';
import { AuthService } from '@app/core/auth/services/auth.service';
import { PageIndexCardComponent } from '@app/shared/components/page-index-card/page-index-card.component';
import { PageMessageComponent } from '@app/shared/components/page-message/page-message.component';
import { ToastService } from '@app/shared/services/toast.service';
import { WebsocketService } from '@app/shared/services/websocket.service';
import { getErrorMessage } from '@app/shared/utils/http.utils';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { GamesPageHeaderComponent } from '../../components/games-page-header/games-page-header.component';
import {
    Card,
    Game,
    GameLog,
    GameMatch,
    GameMatchBet,
    GameMatchCreatedEvent,
    GameMatchEndedEvent,
    GamePoint,
    GameRound,
    GameRoundPlay,
    GameWinnerEvent,
    UserCard,
} from '../../games.model';
import { GamesService } from '../../games.service';
import { Suit } from './../../games.model';
import { GameBetComponent } from './partials/game-bet/game-bet.component';
import { GameRoundComponent } from './partials/game-round/game-round.component';
import { GameUserCardsComponent } from './partials/game-user-cards/game-user-cards.component';
import { GameUsersTableComponent } from './partials/game-users-table/game-users-table.component';

@Component({
    selector: 'app-game-show',
    imports: [
        NgbNavModule,
        GamesPageHeaderComponent,
        PageIndexCardComponent,
        JsonPipe,
        DatePipe,
        GameBetComponent,
        GameUserCardsComponent,
        GameRoundComponent,
        GameUsersTableComponent,
        PageMessageComponent,
    ],
    templateUrl: './game-show.component.html',
    styleUrl: './game-show.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameShowComponent implements OnInit {
    protected readonly tab = signal<'game' | 'logs'>('game');

    protected readonly route = inject(ActivatedRoute);

    protected readonly game = signal<Game>(this.route.snapshot.data['game']);

    protected readonly isAuthPlaying = signal<boolean>(
        this.route.snapshot.data['isAuthPlaying'],
    );

    protected readonly userCards = signal<UserCard[]>(
        this.route.snapshot.data['userCards'],
    );

    protected readonly wsService = inject(WebsocketService);

    protected readonly gamesService = inject(GamesService);

    protected readonly toastService = inject(ToastService);

    protected readonly authService = inject(AuthService);

    protected readonly isJoining = signal<boolean>(false);

    protected readonly isStarting = signal<boolean>(false);

    protected readonly isBetting = signal<boolean>(false);

    protected readonly isPlaying = signal<boolean>(false);

    protected readonly auth = signal<User | null>(this.authService.user());

    protected readonly players = signal<User[]>(this.game().users || []);

    protected readonly match = signal<GameMatch | null>(
        this.game().current_match_data || null,
    );

    protected readonly round = signal<GameRound | null>(
        this.game().current_round_data || null,
    );

    protected readonly lastRound = signal<GameRound | null>(
        this.game().last_round_data || null,
    );

    protected readonly joker = signal<Suit | null>(this.game().joker || null);

    protected readonly logs = signal<GameLog[]>(this.game().logs || []);

    protected readonly nextPlayerToPlay = signal<User | null>(
        this.game().next_player_to_play || null,
    );

    protected readonly nextPlayerToBet = signal<User | null>(
        this.game().next_player_to_bet || null,
    );

    protected readonly title = computed<string>(() => {
        const match = this.match();
        const round = this.round();
        const joker = this.joker();

        const parts = [];

        if (match) {
            parts.push('Partida ' + match.index);
        }

        if (round) {
            parts.push('Rodada ' + round.index);
        }

        if (joker) {
            parts.push('Coringa ' + joker.symbol);
        }

        return parts.length > 0
            ? parts.join(', ')
            : 'Aguardando início do jogo';
    });

    ngOnInit(): void {
        console.log(this.game());
        console.log(this.isAuthPlaying());
        console.log(this.userCards());

        const gameChannel = this.wsService.channel('Game.' + this.game().id);

        gameChannel.listen('.PlayerJoined', this.onPlayerJoined.bind(this));

        gameChannel.listen('.Started', this.onGameStarted.bind(this));

        gameChannel.listen('.Log', this.onGameLog.bind(this));

        gameChannel.listen('.MatchCreated', this.onMatchCreated.bind(this));

        gameChannel.listen('.RequestBet', this.onBetRequested.bind(this));

        gameChannel.listen('.BetCreated', this.onBetCreated.bind(this));

        gameChannel.listen('.MatchStarted', this.onMatchStarted.bind(this));

        gameChannel.listen('.RoundStarted', this.onRoundStarted.bind(this));

        gameChannel.listen('.RequestPlay', this.onPlayRequested.bind(this));

        gameChannel.listen('.CardPlayed', this.onCardPlayed.bind(this));

        gameChannel.listen('.RoundEnded', this.onRoundEnded.bind(this));

        gameChannel.listen('.MatchEnded', this.onMatchEnded.bind(this));

        gameChannel.listen('.Ended', this.onGameEnded.bind(this));

        gameChannel.listen('.Points', this.onGamePoints.bind(this));

        gameChannel.listen('.Winner', this.onGameWinner.bind(this));

        const auth = this.auth();

        if (auth) {
            const userChannel = this.wsService.privateChannel(
                'Game.' + this.game().id + '.User.' + auth.id,
            );

            userChannel.listen('.Cards', this.onDealtCards.bind(this));
        }
    }

    join(): void {
        this.isJoining.set(true);

        this.gamesService
            .join(this.game().id)
            .subscribe({
                next: (status: boolean) => {
                    console.log('Entrou no jogo com sucesso', status);
                },
                error: (error) => {
                    this.toastService.error(getErrorMessage(error));
                },
            })
            .add(() => {
                this.isJoining.set(false);
            });
    }

    start(): void {
        this.isStarting.set(true);

        this.gamesService
            .start(this.game().id)
            .subscribe({
                next: (status: boolean) => {
                    console.log('Jogo iniciado com sucesso', status);
                },
                error: (error) => {
                    this.toastService.error(getErrorMessage(error));
                },
            })
            .add(() => {
                this.isStarting.set(false);
            });
    }

    onPlayCard(card: Card): void {
        if (this.isPlaying()) {
            return;
        }

        if (this.nextPlayerToPlay()?.id !== this.auth()?.id) {
            this.toastService.error('Não é sua vez de jogar!');
            return;
        }

        this.isPlaying.set(true);

        this.gamesService
            .playCard(this.game().id, card.id)
            .subscribe({
                next: (status: boolean) => {
                    console.log('Carta jogada com sucesso', status);
                },
                error: (error) => {
                    this.toastService.error(getErrorMessage(error));
                },
            })
            .add(() => {
                this.isPlaying.set(false);
            });
    }

    onBet(bet: number): void {
        if (this.nextPlayerToBet()?.id !== this.auth()?.id) {
            this.toastService.error('Não é sua vez de apostar!');
            return;
        }

        this.isBetting.set(true);

        this.gamesService
            .bet(this.game().id, bet)
            .subscribe({
                next: (status: boolean) => {
                    console.log('Aposta realizada com sucesso', status);
                },
                error: (error) => {
                    this.toastService.error(getErrorMessage(error));
                },
            })
            .add(() => {
                this.isBetting.set(false);
            });
    }

    private onPlayerJoined(user: User): void {
        console.debug('PlayerJoined', user);

        this.players.update((players) => [...players, user]);

        const isAuth = this.auth()?.id === user.id;

        if (isAuth) {
            this.isAuthPlaying.set(true);
        }

        this.toastService.success(
            (isAuth ? 'Você' : `${user.username}`) + ' entrou no jogo!',
        );
    }

    private onGameStarted(game: Game): void {
        console.debug('GameStarted', game);

        this.game.set(game);
    }

    private onGameLog(log: GameLog) {
        console.debug('GameLog', log);

        this.logs.update((logs) => [log, ...logs]);
    }

    private onMatchCreated(data: GameMatchCreatedEvent): void {
        console.debug('MatchCreated', data);

        this.game.set(data.game);

        this.match.set(data.match);

        this.joker.set(data.joker);
    }

    private onDealtCards(cards: UserCard[]): void {
        console.debug('DealtCards', cards);

        this.userCards.set(cards);
    }

    private onBetRequested(user: User): void {
        console.debug('RequestBet', user);

        this.nextPlayerToBet.set(user);
    }

    private onBetCreated(data: GameMatchBet): void {
        console.debug('BetCreated', data);

        this.players.update((players) =>
            players.map((player) => {
                if (player.id === data.user_id && player.pivot) {
                    return {
                        ...player,
                        pivot: {
                            ...player.pivot,
                            current_bet: data.value,
                        },
                    };
                } else {
                    return player;
                }
            }),
        );
    }

    private onMatchStarted(match: GameMatch): void {
        console.debug('MatchStarted', match);

        this.match.set(match);
    }

    private onRoundStarted(round: GameRound): void {
        console.debug('RoundStarted', round);

        this.round.set(round);

        this.nextPlayerToBet.set(null);
    }

    private onPlayRequested(user: User): void {
        console.debug('RequestPlay', user);

        this.nextPlayerToPlay.set(user);
    }

    private onCardPlayed(data: GameRoundPlay): void {
        console.debug('CardPlayed', data);

        if (this.auth()?.id === data.user.id) {
            this.userCards.update((cards) =>
                cards.map((card) =>
                    card.id === data.card.id
                        ? {
                              ...card,
                              played: true,
                          }
                        : card,
                ),
            );
        }

        this.round.update((round) => {
            if (!round) {
                return round;
            }

            return {
                ...round,
                plays: [...round.plays, data],
            };
        });
    }

    private onRoundEnded(round: GameRound): void {
        console.debug('RoundEnded', round);

        this.lastRound.set(round);

        this.round.set(null);

        this.players.update((players) =>
            players.map((player) => {
                if (player.pivot && player.id === round.winner?.user.id) {
                    return {
                        ...player,
                        pivot: {
                            ...player.pivot,
                            rounds_won: (player.pivot.rounds_won || 0) + 1,
                        },
                    };
                } else {
                    return player;
                }
            }),
        );
    }

    private onMatchEnded(data: GameMatchEndedEvent): void {
        console.debug('MatchEnded', data);

        this.match.set(null);

        this.nextPlayerToPlay.set(null);

        this.players.set(
            data.users.map((user) => {
                return {
                    ...user,
                    pivot: {
                        ...(user.pivot || {}),
                        current_bet: null,
                        rounds_won: 0,
                    },
                };
            }),
        );
    }

    private onGameEnded(game: Game): void {
        console.debug('GameEnded', game);
        this.game.set(game);
    }

    private onGamePoints(data: GamePoint[]) {
        console.debug('GamePoints', data);
    }

    private onGameWinner(data: GameWinnerEvent) {
        console.debug('GameWinner', data);
    }
}
