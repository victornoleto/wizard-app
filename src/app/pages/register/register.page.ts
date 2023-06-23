import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.page.html',
	styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
	
	public fg: FormGroup;
	
	constructor(
		private fb: FormBuilder,
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
		
		let password = this.fg.get('password')?.value;

		this.authService
			.register(username, password)
			.subscribe({
				next: () => {

					loading.dismiss();
				},
				error: err => {

					loading.dismiss();
		
					this.alertService.error(err, 'Não foi possível se cadastrar');
				}
			});
	}

	private createForm() {

		this.fg = this.fb.group({
			username: ['victor', [Validators.required]],
			password: ['sysout', [Validators.required]]
		});
	}
}
