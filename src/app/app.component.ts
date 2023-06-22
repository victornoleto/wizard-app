import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';
import { StorageService } from './services/storage.service';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
})
export class AppComponent {

	constructor(
		private authService: AuthService,
		private router: Router
	) {}

	ngOnInit() {

		this.authService.authState.subscribe(
			state => {
				this.onAuthStateChanged(state);
			}
		);
	}

	private onAuthStateChanged(state: boolean) {

		let path = environment.redirects[state ? 'auth' : 'guest'];

		if (path != window.location.pathname) {
			this.router.navigateByUrl(path);
		}
	}
}

export function checkStorageAuthentication(authService: AuthService, storageService: StorageService) {
	
	return async () => {
		
		// Inicializar storage
		await storageService.init();
		
		// Verificar se o usuário está conectado
		await authService.isAuthenticate();

		// Liberar aplicação
		return Promise.resolve();
	}
}