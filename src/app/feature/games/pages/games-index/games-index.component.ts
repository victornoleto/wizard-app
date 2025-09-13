import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/auth/services/auth.service';
import { PageIndex } from '@app/shared/components/page-index';
import { PageIndexMessagesComponent } from '@app/shared/components/page-index-messages/page-index-messages.component';
import { Filters } from '@app/shared/models/filters.model';
import {
    DEFAULT_COLLECTION,
    LengthAwarePaginator,
} from '@app/shared/models/pagination.model';
import { Search } from '@app/shared/models/search.model';
import { WebsocketService } from '@app/shared/services/websocket.service';
import { getErrorMessage } from '@app/shared/utils/http.utils';
import { Observable } from 'rxjs';
import { GameCreateModalComponent } from '../../components/game-create-modal/game-create-modal.component';
import { Game } from '../../games.model';
import { GamesService } from '../../games.service';
import { GamesTableComponent } from './components/games-table/games-table.component';

@Component({
    selector: 'app-games-index',
    imports: [
        GamesTableComponent,
        PageIndexMessagesComponent,
        GameCreateModalComponent,
    ],
    templateUrl: './games-index.component.html',
    styleUrl: './games-index.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamesIndexComponent extends PageIndex implements OnInit {
    /* usersFilters = viewChild(UsersFiltersComponent); */

    private readonly usersService = inject(GamesService);

    protected readonly filters = signal<Filters>({});

    protected readonly records = signal<LengthAwarePaginator<Game>>(
        DEFAULT_COLLECTION as LengthAwarePaginator<Game>,
    );

    protected readonly wsService = inject(WebsocketService);

    protected readonly authService = inject(AuthService);

    protected readonly router = inject(Router);

    ngOnInit(): void {
        const gamesChannel = this.wsService.channel('Games');

        gamesChannel.listen('.Created', this.onGameCreated.bind(this));

        const auth = this.authService.user();

        const publicChannel = this.wsService.channel('Test');

        publicChannel.unsubscribe();

        publicChannel.subscribe();

        publicChannel.listen(
            '.Message',
            (data: { message: string; user_id?: number }) => {
                console.log('Public channel message received:', data);
                if (data.user_id && auth && data.user_id === auth.id) {
                    this.toastService.success('Canal público funcionando!', {
                        id: 'public-channel',
                    });
                }
            },
        );

        if (auth) {
            const privateChannel = this.wsService.privateChannel(
                'User.' + auth.id,
            );

            privateChannel.listen('.Message', (data: { message: string }) => {
                console.log('Private channel message received:', data.message);
                this.toastService.success('Canal privado funcionando!', {
                    id: 'private-channel',
                });
            });
        }
    }

    testPublicChannelWebsocket(): void {
        this.authService.testPublicChannelWebsocket().subscribe({
            next: (success) => {
                console.log('Public channel test event sent', { success });
            },
            error: (error) => {
                console.error(
                    'Error sending public channel test event:',
                    error,
                );
                this.toastService.error(getErrorMessage(error));
            },
        });
    }

    testPrivateChannelWebsocket(): void {
        this.authService.testPrivateChannelWebsocket().subscribe({
            next: (success) => {
                console.log('Private channel test event sent', { success });
            },
            error: (error) => {
                console.error(
                    'Error sending private channel test event:',
                    error,
                );
                this.toastService.error(getErrorMessage(error));
            },
        });
    }

    override searchObservable(
        search: Search<Filters>,
    ): Observable<LengthAwarePaginator<Game>> {
        return this.usersService.get(search);
    }

    private onGameCreated(game: Game) {
        console.debug('Games.Created', game);

        const perPage = this.pagination().perPage;

        const auth = this.authService.user();

        // Redirecionar para a página do jogo
        if (game.creator.id === auth?.id) {
            this.router.navigate(['/game', game.id]);
        }

        this.records.update((current) => {
            return {
                ...current,
                data: [game, ...current.data.slice(0, perPage - 1)],
                total: current.total + 1,
            };
        });
    }
}
