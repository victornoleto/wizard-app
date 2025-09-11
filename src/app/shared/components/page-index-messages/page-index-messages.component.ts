import { Component, input, output } from '@angular/core';
import { PageMessageComponent } from '@app/shared/components/page-message/page-message.component';

@Component({
    selector: 'app-page-index-messages',
    imports: [PageMessageComponent],
    templateUrl: './page-index-messages.component.html',
    styleUrl: './page-index-messages.component.scss',
})
export class PageIndexMessagesComponent {
    readonly isLoading = input<boolean>(false);
    readonly refresh = output<void>();

    readonly loadingIcon = input<string>('⏳');
    readonly loadingMessage = input<string>('Carregando registros...');
    readonly loadingDetails = input<string | null>(
        'Por favor, aguarde enquanto os dados são carregados.',
    );

    readonly errorIcon = input<string>('🥶');
    readonly errorMessage = input<string>(
        'Não foi possível carregar os registros.',
    );
    readonly errorDetails = input<string | null>(null, {
        alias: 'error',
    });

    readonly emptyIcon = input<string>('🤔');
    readonly emptyMessage = input<string>('Nenhum registro encontrado.');
    readonly emptyDetails = input<string | null>(
        'Tente ajustar os filtros e tente novamente.',
    );
}
