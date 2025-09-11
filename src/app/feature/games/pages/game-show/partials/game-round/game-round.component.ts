import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    signal,
} from '@angular/core';
import { CardComponent } from '@app/feature/games/components/card/card.component';
import { GameRound, GameRoundWinner } from '@app/feature/games/games.model';

@Component({
    selector: 'app-game-round',
    imports: [CardComponent],
    templateUrl: './game-round.component.html',
    styleUrl: './game-round.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameRoundComponent {
    readonly round = input.required<GameRound>();
    readonly message = input.required<string>();
    readonly showWinnerMessage = input<boolean>(true);
    readonly visible = signal<boolean>(true);

    protected readonly winner = computed<GameRoundWinner | null>(
        () => this.round()?.winner || null,
    );
}
