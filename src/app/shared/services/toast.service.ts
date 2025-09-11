import { inject, Injectable } from '@angular/core';
import {
    DefaultDataType,
    HotToastService,
    ToastOptions,
} from '@ngxpert/hot-toast';

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    protected readonly toast = inject(HotToastService);

    success(message: string, options?: ToastOptions<DefaultDataType>): void {
        options = {
            ...options,
            className: 'alert alert-success',
        };
        this.toast.success(message, options);
    }

    error(message: string, options?: ToastOptions<DefaultDataType>): void {
        options = {
            ...options,
            className: 'alert alert-danger',
        };
        this.toast.error(message, options);
    }

    warning(message: string, options?: ToastOptions<DefaultDataType>): void {
        options = {
            ...options,
            className: 'alert alert-warning',
        };
        this.toast.warning(message, options);
    }

    info(message: string, options?: ToastOptions<DefaultDataType>): void {
        options = {
            ...options,
            className: 'alert alert-info',
        };
        this.toast.info(message, options);
    }
}
