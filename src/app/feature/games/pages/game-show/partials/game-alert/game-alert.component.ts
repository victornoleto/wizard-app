import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { User } from '@app/core/auth/models/auth.model';

@Component({
    selector: 'app-game-alert',
    imports: [],
    templateUrl: './game-alert.component.html',
    styleUrl: './game-alert.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameAlertComponent {
    readonly nextPlayerToPlay = input<User | null>(null);
    readonly nextPlayerToBet = input<User | null>(null);
    readonly authId = input<number>();
}
