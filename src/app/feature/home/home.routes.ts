import { Routes } from '@angular/router';
import { authGuard } from '@app/core/middlewares';

export const routes: Routes = [
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () =>
            import('@app/core/layout/auth/auth.component').then(
                (c) => c.AuthComponent,
            ),
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./pages/dashboard/dashboard').then(
                        (c) => c.Dashboard,
                    ),
                title: 'Dashboard',
            },
        ],
    },
];
