import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';
import { GameService } from '../game/game.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
	selector: 'app-game-create',
	templateUrl: './game-create.page.html',
	styleUrls: ['./game-create.page.scss'],
})
export class GameCreatePage implements OnInit {
	
	public fg: FormGroup;
	
	constructor(
		private fb: FormBuilder,
		private router: Router,
		private loadingService: LoadingService,
		private alertService: AlertService,
		private gameService: GameService,
		private toastService: ToastService
	) { }
	
	ngOnInit() {
		this.createForm();
	}

	public async onSubmit() {

		let loading = await this.loadingService.show();

		let body = this.fg.value;

		this.gameService
			.create(body)
			.subscribe({
				next: (game: any) => {

					loading.dismiss();

					this.router.navigate(['/app/game/', game.id]);

					this.toastService.show('Jogo criado com sucesso!');
				},
				error: error => {

					loading.dismiss();
			
					this.alertService.error(
						error,
						'Não foi possível criar o jogo.',
						() => {
							this.onSubmit();
						},
						{
							okText: 'Cancelar',
							okHandler: () => {
								this.router.navigate(['/app/games']);
							}
						}
					);
				}
			});
	}

	private createForm() {

		this.fg = this.fb.group({
			start_match: [1, [Validators.required]],
			max_matches: [20, Validators.required]
		});
	}
	
}
