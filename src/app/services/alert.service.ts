import { Injectable } from '@angular/core';
import { AlertController, AlertOptions } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class AlertService {

	public blockOtherAlerts: boolean = false;

    constructor(
        public alertCtr: AlertController
    ) {
    }

	public async show(message: string, description?: string, params?: any) {

		if (this.blockOtherAlerts) return;

		if (params.blockOtherAlerts) {
			this.blockOtherAlerts = true;
		}

		var buttons: any = [
			{
				text: params?.okText || 'Fechar',
				cssClass: 'btn-light',
				role: 'cancel',
				handler: params?.okHandler || (() => {})
			}
		];

		if (params?.buttons) {
			buttons = buttons.concat(params.buttons);
		}

		let headerDict: any = {
			error: 'Atenção!',
			success: 'Sucesso!'
		};
		
		let header = headerDict.error; // default

		if (params) {

			if (params.header) {
				header = params.header;

			} else if (params.type && headerDict[params.type]) {
				header = headerDict[params.type];
			}
		}

		var options: any = {
			header: header,
			subHeader: message,
			buttons: buttons.reverse()
		};

		if (description) {
			options.message = description;
		}

		let alert = await this.alertCtr.create(options);

		alert.present();
	}

	public async error(err: any, description: string, tryAgainHandler?: Function, params?: any) {

		let message: string = '';

		if (err.error && err.error.errors && Array.isArray(err.error.errors)) {
			message = err.error.errors.join(' ');
		
		} else {

			message = typeof err == 'string' ? 
				err :
				typeof err.error == 'string' ?
					err.error.error :
					err.error.message;
		}

		if (!params) {
			params = {};
		}

		params.type = 'error';

		if (!params.buttons) {
			params.buttons = [];
		}

		if (tryAgainHandler) {

			params.buttons.push({
				text: params?.tryAgainText || 'Tentar novamente',
				cssClass: 'btn-primary',
				handler: tryAgainHandler
			});
		}

		this.show(
			message,
			description,
			params,
		);
	}

	public async success(message: string, description?: string, params?: any) {

		if (!params) {
			params = {}
		}

		params.type = 'success';

		this.show(
			message,
			description,
			params
		);
	}
}
