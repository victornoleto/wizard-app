import { Routes } from '@angular/router';
import { authGuard } from '@app/core/middlewares';
import {
    gameResolver,
    isAuthPlayingResolver,
    userCardsResolver,
} from './games.resolver';

export const routes: Routes = [
    {
        path: 'games',
        canActivate: [authGuard],
        loadComponent: () =>
            import('@app/core/layout/auth/auth.component').then(
                (c) => c.AuthComponent,
            ),
        children: [
            {
                path: '',
                title: 'Jogos',
                loadComponent: () =>
                    import('./pages/games-index/games-index.component').then(
                        (c) => c.GamesIndexComponent,
                    ),
            },
        ],
    },
    {
        path: 'game/:id',
        canActivate: [authGuard],
        resolve: {
            game: gameResolver,
            isAuthPlaying: isAuthPlayingResolver,
            userCards: userCardsResolver,
        },
        loadComponent: () =>
            import('@app/core/layout/auth-blank/auth-blank.component').then(
                (c) => c.AuthBlankComponent,
            ),
        children: [
            {
                path: '',
                title: 'Jogo',
                loadComponent: () =>
                    import('./pages/game-show/game-show.component').then(
                        (c) => c.GameShowComponent,
                    ),
            },
        ],
    },
];
