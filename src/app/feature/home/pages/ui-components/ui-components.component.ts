import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '@app/shared/services/toast.service';

@Component({
    selector: 'app-ui-components',
    imports: [],
    templateUrl: './ui-components.component.html',
    styleUrl: './ui-components.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiComponentsComponent {
    protected readonly toastService = inject(ToastService);

    constructor() {
        //this.showToastExamples();
    }

    private showToastExamples(): void {
        this.toastService.success(
            'Preencha os campos obrigatórios para salvar o usuário.',
            {
                //duration: 5000,
            },
        );

        this.toastService.error(
            'Caso não queira alterar a senha, deixe os campos de senha em branco.',
            {
                //duration: 5000,
            },
        );

        this.toastService.warning('Lembre-se de que o e-mail deve ser único.', {
            //duration: 5000,
        });

        this.toastService.info('Você pode editar os dados do usuário.', {
            //duration: 5000,
        });
    }
}
