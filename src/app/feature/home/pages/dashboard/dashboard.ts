import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/auth/services/auth.service';
import { ToastService } from '@app/shared/services/toast.service';
import { WebsocketService } from '@app/shared/services/websocket.service';

@Component({
    selector: 'app-dashboard',
    imports: [],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss',
})
export class Dashboard {
    protected readonly router = inject(Router);
    protected readonly authService = inject(AuthService);
    protected readonly toastService = inject(ToastService);
    protected readonly wsService = inject(WebsocketService);

    logout() {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
    }
}
