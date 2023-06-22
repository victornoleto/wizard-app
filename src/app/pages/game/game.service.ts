import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
    providedIn: 'root'
})
export class GameService {

    constructor(
		private httpService: HttpService
	) { }

	public join(id: number) {
		return this.httpService.post(`/game/${id}/join`);
	}

	public start(id: number) {
		return this.httpService.post(`/game/${id}/start`);
	}

	public playCard(gameId: number, cardId: number) {
		return this.httpService.post(`/game/${gameId}/play/${cardId}`);
	}

	public bet(gameId: number, value: number) {
		return this.httpService.post(`/game/${gameId}/bet/${value}`);
	}
}
