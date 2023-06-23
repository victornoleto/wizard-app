import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';
import { GameService } from '../game/game.service';
import { WebsocketService } from 'src/app/services/ws.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-games',
	templateUrl: './games.page.html',
	styleUrls: ['./games.page.scss'],
})
export class GamesPage implements OnInit {

	public list: any[] = [];
	
	constructor(
		private loadingService: LoadingService,
		private alertService: AlertService,
		private gameService: GameService,
		private ws: WebsocketService,
		private authService: AuthService
	) { }
	
	ngOnInit() {

		this.load();

		let gameChannel = this.ws.channel(`Games`);

		gameChannel.listen('.Created', (data: any) => {

			console.debug('Created', data);

			var game = data.game;

			game.creator = data.player;

			this.list.unshift(game);
		});
	}

	public async load() {

		let loading = await this.loadingService.show();

		this.gameService
			.get()
			.subscribe({
				next: (response: any) => {

					loading.dismiss();

					this.list = response;
				},
				error: (error: any) => {

					console.error(error);

					loading.dismiss();
			
					this.alertService.error(
						error,
						'Não foi possível obter a lista de jogos.',
						() => {
							this.load();
						},
					);
				}
			});
	}

	public logout() {
		this.authService.logout();
	}
}
