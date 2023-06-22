import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {

    constructor(
		private loadingCtrl: LoadingController
	) { }

	/**
	 * Criar nova instância de loading
	 * @param params
	 */
	public async show(params: any = "", className?: string): Promise<HTMLIonLoadingElement> {

		let options: any;

		if (typeof params === 'string' || params instanceof String) {

			options = {
				spinner: 'crescent',
				message: params,
				translucent: true,
				cssClass: 'custom-loading'
			}

		} else {
			options = params;
		}

		if (className) {
			options.cssClass += ` ${ className }`;
		}

		let instance = await this.loadingCtrl.create(options);

		await instance.present();

		return instance;
	}
}
