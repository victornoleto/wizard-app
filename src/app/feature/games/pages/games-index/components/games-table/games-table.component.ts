import {
    ChangeDetectionStrategy,
    Component,
    input,
    model,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Game } from '@app/feature/games/games.model';
import { PaginationComponent } from '@app/shared/components/pagination/pagination.component';
import { TableButtonsComponent } from '@app/shared/components/table/table-buttons/table-buttons.component';
import {
    LoadingDirective,
    TableSort,
    TableSortableDirective,
} from '@app/shared/directives';
import {
    LengthAwarePaginator,
    Paginator,
} from '@app/shared/models/pagination.model';

@Component({
    selector: 'app-games-table',
    imports: [
        TableSortableDirective,
        PaginationComponent,
        TableButtonsComponent,
        FormsModule,
        LoadingDirective,
        RouterLink,
    ],
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
