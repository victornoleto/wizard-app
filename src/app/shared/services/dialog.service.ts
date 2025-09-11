import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
    DialogButton,
    DialogComponent,
    DialogConfig,
} from '@app/shared/components/dialog/dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { getErrorMessage } from '../utils/http.utils';

@Injectable({
    providedIn: 'root',
})
export class DialogService {
    private modalService = inject(NgbModal);

    open(config: DialogConfig): void {
        const modalRef = this.modalService.open(DialogComponent, {
            size: config.size || 'md',
            backdrop: config.backdrop || 'static',
            keyboard: config.keyboard || true,
            centered: config.centered || false,
        });

        modalRef.componentInstance.data.set(config);
    }

    error({
        title = '🔴 Atenção!',
        message,
        error,
        actions = [],
        tryAgain,
    }: {
        title?: string;
        message: string;
        error?: HttpErrorResponse;
        actions?: DialogButton[];
        tryAgain?: () => void;
    }): void {
        if (tryAgain) {
            actions.push({
                text: 'Tentar novamente',
                className: 'btn-primary',
                closeModal: true,
                handler: tryAgain,
            });
        }

        this.open({
            title,
            message,
            details: error ? getErrorMessage(error) : 'Unknown error',
            actions,
            type: 'error',
        });
    }
}
