import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';

import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

	public fg: FormGroup;
	
	constructor(
		private fb: FormBuilder,
		private router: Router,
		private authService: AuthService,
		private loadingService: LoadingService,
		private alertService: AlertService
	) { }
	
	ngOnInit() {
		this.createForm();
	}

	public async onSubmit() {

		let loading = await this.loadingService.show();

		let username = this.fg.get('username')?.value;
		
		//let password = this.fg.get('password')?.value;

		this.authService
			.login(username)
			.subscribe({
				next: () => {

					loading.dismiss();
				},
				error: error => {

					loading.dismiss();
		
					this.alertService.error(
						error,
						'Não foi possível fazer o login.',
						() => {
							this.onSubmit();
						}
					);
				}
			});
	}

	private createForm() {

		this.fg = this.fb.group({
			username: ['', [Validators.required]],
			//password: ['sysout', Validators.required]
		});
	}
}
