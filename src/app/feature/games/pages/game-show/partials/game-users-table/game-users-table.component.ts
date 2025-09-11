import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { User } from '@app/core/auth/models/auth.model';

@Component({
    selector: 'app-game-users-table',
    imports: [],
    templateUrl: './game-users-table.component.html',
    styleUrl: './game-users-table.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameUsersTableComponent {
    readonly users = input.required<User[]>();
}
