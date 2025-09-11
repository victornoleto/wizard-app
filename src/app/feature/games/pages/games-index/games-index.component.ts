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
import { PageIndexCardComponent } from '@app/shared/components/page-index-card/page-index-card.component';
import { PageIndexMessagesComponent } from '@app/shared/components/page-index-messages/page-index-messages.component';
import { Filters } from '@app/shared/models/filters.model';
import {
    DEFAULT_COLLECTION,
    LengthAwarePaginator,
} from '@app/shared/models/pagination.model';
import { Search } from '@app/shared/models/search.model';
import { WebsocketService } from '@app/shared/services/websocket.service';
import { Observable } from 'rxjs';
import { GameCreateModalComponent } from '../../components/game-create-modal/game-create-modal.component';
import { GamesPageHeaderComponent } from '../../components/games-page-header/games-page-header.component';
import { Game } from '../../games.model';
import { GamesService } from '../../games.service';
import { GamesTableComponent } from './components/games-table/games-table.component';

@Component({
    selector: 'app-games-index',
    imports: [
        GamesPageHeaderComponent,
        GamesTableComponent,
        PageIndexCardComponent,
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

        const auth = this.authService.user();

        gamesChannel.listen('.Created', (game: Game) => {
            console.log('Games.Created', game);

            const perPage = this.pagination().perPage;

            // Redirecionar para a página do jogo
            if (game.creator.id === auth?.id) {
                this.router.navigate(['/games', game.id]);
            }

            this.records.update((current) => {
                return {
                    ...current,
                    data: [game, ...current.data.slice(0, perPage - 1)],
                    total: current.total + 1,
                };
            });
        });
    }

    override searchObservable(
        search: Search<Filters>,
    ): Observable<LengthAwarePaginator<Game>> {
        return this.usersService.get(search);
    }
}
