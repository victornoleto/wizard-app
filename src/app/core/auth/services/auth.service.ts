import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
    LoginRequest,
    RegisterRequest,
    User,
} from '@app/core/auth/models/auth.model';
import { BooleanResponse } from '@app/shared/models/base.model';
import { StorageService } from '@app/shared/services/storage.service';
import { env } from '@env';
import { firstValueFrom, map, Observable, switchMap, tap } from 'rxjs';
import { OAuthToken } from '../auth.models';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    protected readonly http = inject(HttpClient);
    protected readonly storageService = inject(StorageService);

    user = signal<User | null>(null);
    authState = signal<boolean>(false);
    token = signal<OAuthToken | null>(null);

    constructor() {
        // Carregar token do localStorage na inicialização
        this.loadTokenFromStorage();
    }

    login(credentials: LoginRequest): Observable<User> {
        const data = {
            grant_type: 'password',
            username: credentials.email,
            password: credentials.password,
            client_id: env.clientId,
            client_secret: env.clientSecret,
        };

        return this.http.post<OAuthToken>(`${env.url}/oauth/token`, data).pipe(
            tap((token: OAuthToken) => {
                this.saveToken(token);
            }),
            switchMap(() => this.getUser()),
            tap(() => {
                this.authState.set(true);
            }),
        );
    }

    refreshToken(): Observable<OAuthToken> {
        const currentToken = this.token();
        if (!currentToken?.refresh_token) {
            throw new Error('No refresh token available');
        }

        const data = {
            grant_type: 'refresh_token',
            refresh_token: currentToken.refresh_token,
            client_id: env.clientId,
            client_secret: env.clientSecret,
        };

        return this.http.post<OAuthToken>(`${env.url}/oauth/token`, data).pipe(
            tap((newToken: OAuthToken) => {
                this.saveToken(newToken);
                //console.debug('[AuthService] Token refreshed', { newToken });
            }),
        );
    }

    logout(): void {
        this.user.set(null);
        this.authState.set(false);
        this.token.set(null);
        this.storageService.remove('token');
        /* return this.http.post<void>(`${env.url}/api/logout`, {}).pipe(
            tap(() => {
                //console.debug('[AuthService] User logged out');
            }),
        ); */
    }

    register(data: RegisterRequest): Observable<User> {
        return this.http.post<User>(
            `${env.url}/api/auth/register`,
            data,
        ); /* .pipe(
            tap((user: User) => {
                //console.debug('[AuthService] User registered', { user });
                this.user.set(user);
                this.authState.set(true);
            }),
        ); */
    }

    getUser(): Observable<User> {
        return this.http.get<User>(`${env.url}/api/profile`).pipe(
            tap((user: User) => {
                //console.debug('[AuthService] User updated', { user });
                this.user.set(user);
            }),
        );
    }

    async isAuthenticated(): Promise<boolean> {
        try {
            // Se no futuro a rota de obter o usuário ficar "pesada" demais,
            // criar uma rota apenas para verificar a autenticação
            await firstValueFrom(this.getUser());
            this.authState.set(true);
        } catch (error: unknown) {
            if (error && (error as HttpErrorResponse).status !== 401) {
                console.error(
                    '[AuthService] Error checking initial auth state',
                    error,
                );
            }
            this.authState.set(false);
        }
        //console.debug('[AuthService] Auth state checked', this.authState());
        return this.authState();
    }

    async sanctumCsrf(): Promise<string | null> {
        await firstValueFrom(this.http.get(`${env.url}/sanctum/csrf-cookie`));

        const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);

        return match ? decodeURIComponent(match[1]) : null;
    }

    private saveToken(token: OAuthToken): void {
        this.storageService.save('token', token);
        this.token.set(token);
    }

    loadTokenFromStorage(): void {
        const storedToken = this.storageService.get<OAuthToken>('token');
        this.token.set(storedToken);
    }

    getAccessToken(): string | null {
        const currentToken = this.token();
        return currentToken?.access_token || null;
    }

    testPrivateChannelWebsocket(): Observable<boolean> {
        return this.http
            .post<BooleanResponse>(env.url + '/api/test/private-event', {})
            .pipe(map((response) => response.status));
    }

    testPublicChannelWebsocket(): Observable<boolean> {
        return this.http
            .post<BooleanResponse>(env.url + '/api/test/public-event', {})
            .pipe(map((response) => response.status));
    }
}
