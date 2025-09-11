import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '@app/core/auth/services/auth.service';

export const guestGuard: CanActivateFn = () => {
    const router = inject(Router);
    const authService = inject(AuthService);

    try {
        // Verifica se o usuário está realmente autenticado (cookie + sessão válida)
        const isAuthenticated = authService.authState();

        if (!isAuthenticated) {
            return true;
        }
    } catch (error) {
        console.error(
            '[GuestGuard] Não foi possível verificar a autenticação:',
            error,
        );
        return true;
    }

    router.navigate(['/dashboard']);

    return false;
};
