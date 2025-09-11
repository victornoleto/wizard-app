import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/auth/services/auth.service';

@Component({
    selector: 'app-dashboard',
    imports: [],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss',
})
export class Dashboard {
    protected readonly router = inject(Router);
    protected readonly authService = inject(AuthService);

    logout() {
        this.authService.logout();
    }

    getUserData() {
        this.authService.getUser().subscribe({
            next: (user) => {
                console.debug('User data:', user);
            },
            error: (error) => {
                console.error('Failed to fetch user data:', error);
            },
        });
    }
}
