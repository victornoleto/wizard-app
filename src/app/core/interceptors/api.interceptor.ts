import {
    HttpHandlerFn,
    HttpInterceptorFn,
    HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@app/core/auth/services/auth.service';

export const ApiInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn,
) => {
    const authService = inject(AuthService);

    let modifiedReq = req.clone();

    if (!req.headers.has('Accept')) {
        modifiedReq = modifiedReq.clone({
            setHeaders: {
                Accept: 'application/json',
            },
        });
    }

    // Verificar se a requisição tem o header X-Skip-Auth para pular autenticação
    const skipAuth = req.headers.has('X-Skip-Auth');

    if (!skipAuth) {
        const accessToken = authService.getAccessToken();
        if (accessToken) {
            modifiedReq = modifiedReq.clone({
                setHeaders: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        }
    } else {
        // Remove o header X-Skip-Auth antes de enviar a requisição
        modifiedReq = modifiedReq.clone({
            headers: modifiedReq.headers.delete('X-Skip-Auth'),
        });
    }

    return next(modifiedReq);
};
