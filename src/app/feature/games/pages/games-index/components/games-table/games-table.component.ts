import {
    ChangeDetectionStrategy,
    Component,
    input,
    model,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Game } from '@app/feature/games/games.model';
import { TableSort } from '@app/shared/directives';
import {
    LengthAwarePaginator,
    Paginator,
} from '@app/shared/models/pagination.model';

@Component({
    selector: 'app-games-table',
    imports: [RouterLink],
    templateUrl: './games-table.component.html',
    styleUrl: './games-table.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamesTableComponent {
    readonly games = input.required<LengthAwarePaginator<Game>>();
    readonly isLoading = input.required<boolean>();
    readonly sort = model.required<TableSort>();
    readonly pagination = model.required<Paginator>();
}
