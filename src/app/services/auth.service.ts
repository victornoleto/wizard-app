import { Injectable, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';

import { HttpService } from './http.service';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    // Estados
    public authInitialized: boolean = false;
    public authCurrentState: boolean = false;
    public authState = new EventEmitter();
    
    // Usuário autenticado
    public user: any;

    constructor(
        private httpService: HttpService,
        private storageService: StorageService,
    ) { }

    public async isAuthenticate(): Promise<boolean> {

        if (this.authInitialized == false) {

            let state: boolean = false;

            // Buscar informações no storage
            var token = await this.storageService.get('token');
            var user = await this.storageService.get('user');

            if (token && user) {

                state = true;

                // Setar token de autenticação
                this.httpService.setToken(token);

                // Salvar informações do usuário autenticado na memória do service
                this.user = user;
            }

            // Atualizar status atual
            this.updateAuthState(state);

            // Salvar referência do status atual
            this.authInitialized = true;

            return state;

        } else {
            return this.authCurrentState;
        }
    }

	public login(username: string, password: string): Observable<void> {

		return this.auth(username, password, '/login');
	}

    public register(username: string, password: string): Observable<void>{

        return this.auth(username, password, '/register');
    }

    public logout(): void {

        /* if (this.authCurrentState == false) {
            return;
        }

        // Descadastrar dispositivo
        this.pushService.rmvDevice(this.httpService.getToken());

        // Apagar dados do usuário
		this.user = null;
		this.storageService.remove("user");

        // Apagar dados do token
		this.httpService.destroyToken();
        delete this.httpService.userId; */

        // Emit evento de logout
        this.authCurrentState = false;
		this.authState.next(this.authCurrentState);
	}

    private auth(username: string, password: string, url: string): Observable<void> {

        let r = this.httpService
            .post(url, { username, password })
            .pipe(
                map((response: any) => {

                    // Criar token
                    this.httpService.createToken(username, password);

                    // Salvar usuário no storage
                    this.storageService.set('user', response);

                    // Atualizar service
                    this.user = response;
                    this.updateAuthState(true);

                    return response;
                })
            );

        return r;
    }

    private updateAuthState(state: boolean, emit: boolean = true) {

        this.authCurrentState = state;

        if (emit) {
            this.authState.next(this.authCurrentState);
        }
    }
}
