import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/games',
        pathMatch: 'full',
    },
    {
        path: '',
        loadChildren: () =>
            import('./core/auth/auth.routes').then((m) => m.routes),
    },
    {
        path: '',
        loadChildren: () =>
            import('./feature/home/home.routes').then((m) => m.routes),
    },
    {
        path: '',
        loadChildren: () =>
            import('./feature/games/games.routes').then((m) => m.routes),
    },
];
