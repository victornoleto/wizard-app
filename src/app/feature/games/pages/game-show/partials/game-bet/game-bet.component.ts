import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    output,
    signal,
} from '@angular/core';
import { User } from '@app/core/auth/models/auth.model';
import { AuthService } from '@app/core/auth/services/auth.service';
import { GameMatch } from '@app/feature/games/games.model';

@Component({
    selector: 'app-game-bet',
    imports: [],
    templateUrl: './game-bet.component.html',
    styleUrl: './game-bet.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameBetComponent {
    readonly gameId = input.required<number>();

    readonly match = input.required<GameMatch>();

    readonly player = input.required<User>();

    readonly isBetting = input.required<boolean>();

    protected readonly authService = inject(AuthService);

    protected readonly auth = signal<User | null>(this.authService.user());

    protected readonly options = computed<number[]>(() => {
        const totalRounds = this.match()?.index || 0;
        return Array.from({ length: totalRounds + 1 }, (_, i) => i);
    });

    protected readonly selected = signal<number | null>(null);

    readonly bet = output<number>();

    submit(): void {
        const selected = this.selected();
        if (selected !== null) {
            this.bet.emit(selected);
        }
    }
}
