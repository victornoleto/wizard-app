import { Component, inject, OnInit } from '@angular/core';
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
export class Dashboard implements OnInit {
    protected readonly router = inject(Router);
    protected readonly authService = inject(AuthService);
    protected readonly toastService = inject(ToastService);
    protected readonly wsService = inject(WebsocketService);

    ngOnInit(): void {
        const auth = this.authService.user();

        const publicChannel = this.wsService.channel('Test');

        publicChannel.listen(
            '.Message',
            (data: { message: string; user_id?: number }) => {
                console.log('Public channel message received:', data);
                if (data.user_id && auth && data.user_id === auth.id) {
                    this.toastService.success('Canal público funcionando!');
                }
            },
        );

        if (auth) {
            const privateChannel = this.wsService.privateChannel(
                'User.' + auth.id,
            );

            privateChannel.listen('.Message', (data: { message: string }) => {
                console.log('Private channel message received:', data.message);
                this.toastService.success('Canal privado funcionando!');
            });
        }
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
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

    testPublicChannelWebsocket(): void {
        console.log('Testing public channel websocket connection...');
        this.authService.testPublicChannelWebsocket().subscribe({
            next: (success) => {
                console.log('Public channel test event sent', { success });
            },
            error: (error) => {
                console.error(
                    'Error sending public channel test event:',
                    error,
                );
            },
        });
    }

    testPrivateChannelWebsocket(): void {
        console.log('Testing private channel websocket connection...');
        this.authService.testPrivateChannelWebsocket().subscribe({
            next: (success) => {
                console.log('Private channel test event sent', { success });
            },
            error: (error) => {
                console.error(
                    'Error sending private channel test event:',
                    error,
                );
            },
        });
    }
}
