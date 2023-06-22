import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    constructor(
        private toast: ToastController
    ) {
    }

    /**
    * Apresenta o toast em tela
    * @param params
    * @param autoClose
    */
    public show(params: any, autoClose: any = true, position: string = "bottom") {

        let options: any;

        if (typeof params === 'string' || params instanceof String) {

            options = {
                position: position,
                message: params,
                buttons: [{ text: "Fechar", role: "cancel" }]
            }

            if (autoClose) {
                options.duration = 5000;
            }

        } else {
            options = params;
        }

        this.toast.create(options).then(toast => {

            toast.present();

            toast.onDidDismiss().then(() => {
            });

        });
    }
}
