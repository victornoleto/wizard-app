import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';

import Swiper from 'swiper';
import { GameService } from './game.service';
import { AlertService } from 'src/app/services/alert.service';
import { WebsocketService } from 'src/app/services/ws.service';
import { AuthService } from 'src/app/services/auth.service';
import { Channel } from 'laravel-echo';
import { ToastService } from 'src/app/services/toast.service';

@Component({
	selector: 'app-game',
	templateUrl: './game.page.html',
	styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

	@ViewChild('slider', { static: true }) sliderElement: ElementRef;

	public gameId: number;
	public joined: boolean = false;
	
	public user: any;
	public game: any;
	public match: any;
	public round: any;
	public joker: any;
	public players: any[] = [];
	public logs: any[] = [];
	public cards: any[] = [];
	public lastRoundData: any;
	public currentRoundData: any;
	public roundsData: any[] = [];
	public plays: any[] = [];
	public requestCard: boolean = false;
	public requestBet: boolean = false;
	public message: string = '';

	private gameChannel: Channel;
	private userChannel: Channel;
	
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private loadingService: LoadingService,
		private gameService: GameService,
		private alertService: AlertService,
		private authService: AuthService,
		private ws: WebsocketService,
		private toastService: ToastService
	) {

		this.user = this.authService.user;

		this.route.params.subscribe(params => {
			this.gameId = params['id'];
		});
	}
	
	ngOnInit() {

		console.log(this.sliderElement);

		var swiper = new Swiper(this.sliderElement.nativeElement, {});

		this.join();
	}

	public async join() {

		let loading = await this.loadingService.show();
	
		let onError = (error: any) => {

			console.error('err', error);

			loading.dismiss();
			
			this.alertService.error(
				error,
				'Não foi possível entrar no jogo',
				() => {
					this.join();
				},
				{
					okText: 'Cancelar',
					okHandler: () => {
						this.router.navigate(['/games']);
					}
				}
			);
		}
		
		let onSuccess = (response: any) => {

			console.clear();

			loading.dismiss();

			this.onJoined(response);
		};
	
		this.gameService
			.join(this.gameId)
			.subscribe({
				next: onSuccess,
				error: onError
			});
	}

	public async start() {

		let loading = await this.loadingService.show();
	
		let onError = (error: any) => {

			loading.dismiss();
			
			this.alertService.error(
				error,
				'Não foi possível iniciar no jogo',
				() => {
					this.start();
				}
			);
		}
		
		let onSuccess = () => {
			loading.dismiss();
		};
	
		this.gameService
			.start(this.gameId)
			.subscribe({
				next: onSuccess,
				error: onError
			});
	}

	public async onCardSelect(card: any) {

		if (!this.requestCard) return;

		let loading = await this.loadingService.show();
	
		let onError = (error: any) => {

			loading.dismiss();
			
			this.alertService.error(
				error,
				'Não foi possível jogar a carta',
				() => {
					this.onCardSelect(card);
				}
			);
		}
		
		let onSuccess = () => {

			loading.dismiss();

			this.requestCard = false;

			card.played = true;
		};
	
		this.gameService
			.playCard(this.gameId, card.id)
			.subscribe({
				next: onSuccess,
				error: onError
			});
	}

	public async onBet(value: any) {

		if (!this.requestBet || isNaN(value)) return;

		let loading = await this.loadingService.show();
	
		let onError = (error: any) => {

			loading.dismiss();
			
			this.alertService.error(
				error,
				'Não foi possível fazer a aposta',
				() => {
					this.onBet(value);
				}
			);
		}
		
		let onSuccess = () => {

			loading.dismiss();

			this.requestBet = false;
		};
	
		this.gameService
			.bet(this.gameId, value)
			.subscribe({
				next: onSuccess,
				error: onError
			});
	}

	private onJoined(response: any) {

		console.log('Joined', response);
		
		this.joined = true;
		
		// Setar status atual
		this.game = response.game;
		this.match = response.match;
		this.round = response.round;
		this.joker = response.joker;
		this.players = response.players;
		this.logs = response.logs;
		this.cards = response.cards;
		this.currentRoundData = response.currentRoundData;
		this.roundsData = response.roundsData;

		if (this.roundsData.length > 0 && this.round) {
			this.lastRoundData = this.roundsData[this.roundsData.length - 1];
		}

		if (response.nextPlayerToBet) {
			this.onRequestBet(response.nextPlayerToBet);
		}

		if (response.nextPlayerToPlay) {
			this.onRequestCard(response.nextPlayerToPlay);
		}

		this.loadEvents();
	}

	private async loadEvents() {

		let userId = this.user.id;
		let gameId = this.gameId;

		this.gameChannel = this.ws.channel(`Game.${gameId}`);
		this.userChannel = this.ws.channel(`Game.${gameId}.User.${userId}`);

		this.loadGameMainEvents();
		this.loadGameMatchEvents();
		this.loadGameRoundEvents();
		this.loadGameRequestEvents();
		this.loadUserEvents();
	}

	private loadGameMainEvents() {

		this.gameChannel.listen('.PlayerJoined', (event: any) => {
			this.onPlayerJoined(event);
		});

		this.gameChannel.listen('.Started', (event: any) => {
			this.onGameStarted(event);
		});

		this.gameChannel.listen('.Ended', (event: any) => {
			this.onGameEnded(event);
		});

		this.gameChannel.listen('.Log', (event: any) => {
			this.onGameLog(event);
		});

		this.gameChannel.listen('.FinalScores', (event: any) => {
			this.onGameFinalScores(event);
		});

		this.gameChannel.listen('.Winner', (event: any) => {
			this.onGameWinner(event);
		});
	}

	private loadGameMatchEvents() {

		this.gameChannel.listen('.MatchCreated', (event: any) => {
			this.onMatchCreated(event);
		});

		this.gameChannel.listen('.BetSetted', (event: any) => {
			this.onBetSetted(event);
		});

		this.gameChannel.listen('.MatchStarted', (event: any) => {
			this.onMatchStarted(event);
		});

		this.gameChannel.listen('.MatchEnded', (event: any) => {
			this.onMatchEnded(event);
		});

		this.gameChannel.listen('.ScoreCreated', (event: any) => {
			this.onScoreCreated(event);
		});
	}

	private loadGameRoundEvents() {

		this.gameChannel.listen('.RoundStarted', (event: any) => {
			this.onRoundStarted(event);
		});

		this.gameChannel.listen('.CardPlayed', (event: any) => {
			this.onCardPlayed(event);
		});

		this.gameChannel.listen('.RoundEnded', (event: any) => {
			this.onRoundEnded(event);
		});
	}

	private loadGameRequestEvents() {

		this.gameChannel.listen('.RequestBet', (event: any) => {
			this.onRequestBet(event.player);
		});

		this.gameChannel.listen('.RequestCard', (event: any) => {
			this.onRequestCard(event.player);
		});
	}

	private loadUserEvents() {

		this.userChannel.listen('.CardsReceived', (event: any) => {

			console.debug('CardsReceived', event);

			this.cards = event.cards;

		});
	}

	private onPlayerJoined(event: any) {

		console.debug('PlayerJoined', event);

		//this.toastService.show(`O jogador ${event.player.username} entrou no jogo.`);

		this.players.push(event.player);
	}

	private onGameStarted(event: any) {

		console.debug('GameStarted', event);
			
		this.game = event.game;
	}

	private onGameEnded(event: any) {

		console.debug('GameEnded', event);
			
		this.game = event.game;
	}

	private onGameLog(event: any) {

		console.debug('GameLog', event);
			
		this.logs.push(event.log);
	}

	private onGameFinalScores(event: any) {

		console.debug('FinalScores', event);

		// TODO ...
	}

	private onGameWinner(event: any) {

		console.debug('Winner', event);

		// TODO ...
	}

	private onMatchCreated(event: any) {
		
		console.debug('MatchCreated', event);
			
		this.game = event.game;

		this.match = event.match;

		this.joker = event.joker;

		this.players.forEach(player => {
			player.pivot.current_bet = null;
			player.pivot.rounds_won = null;
		});

		this.lastRoundData = null;
		this.currentRoundData = null;
	}

	private onBetSetted(event: any) {

		console.debug('BetSetted', event);

		this.players.forEach(player => {

			if (player.id == event.player.id) {
				player.pivot.current_bet = event.bet;
			}

		});
	}

	private onMatchStarted(event: any) {
		
		console.debug('MatchStarted', event);
			
		this.game = event.game;

		this.match = event.match;
	}

	private onMatchEnded(event: any) {
		
		console.debug('MatchEnded', event);
			
		this.game = event.game;

		this.match = event.match;
	}

	private onScoreCreated(event: any) {
		
		console.debug('ScoreCreated', event);

		this.players.forEach(player => {

			if (player.id == event.player.id) {

				if (player.pivot.score) {
					player.pivot.score += event.score;

				} else {
					player.pivot.score = event.score;
				}
			}

		});
	}

	private onRoundStarted(event: any) {
		
		console.debug('RoundStarted', event);
			
		this.game = event.game;

		this.round = event.round;

		if (this.currentRoundData) {
			this.lastRoundData = this.currentRoundData;
		}

		this.currentRoundData = null;
	}

	private onRoundEnded(event: any) {
		
		console.debug('RoundEnded', event);
			
		this.game = event.game;

		this.round = event.round;

		this.currentRoundData.winner = {
			player: event.winner,
			card: event.card
		};

		this.players.forEach(player => {

			if (player.id == event.winner.id) {

				if (player.pivot.rounds_won) {
					player.pivot.rounds_won++;

				} else {
					player.pivot.rounds_won = 0;
				}
			}

		});

		this.roundsData.push(this.currentRoundData);
	}

	private onCardPlayed(event: any) {

		console.debug('CardPlayed', event);

		if (!this.currentRoundData) {

			this.currentRoundData = {
				matchIndex: this.match.index,
				index: this.round.index,
				plays: []
			};
		}

		this.currentRoundData.plays.push(event);
	}
 
	private onRequestCard(player: any) {

		this.requestCard = player.id == this.user.id;

		if (this.requestCard) {
			//this.toastService.show('É a sua vez de selecionar uma carta!');
			this.message = '<b>É a sua vez de jogar uma carta!</b>';
		
		} else {
			this.message = `É a vez de <b>${player.username}</b> jogar uma carta!`;
		}
	}

	private onRequestBet(player: any) {

		this.requestBet = player.id == this.user.id;

		if (this.requestBet) {
			//this.toastService.show('É a sua vez de apostar!');
			this.message = '<b>É a sua vez de apostar!</b>';

		} else {
			this.message = `É a vez de <b>${player.username}</b> apostar!`;
		}
	}
}
