import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LoadingService {
    private readonly _isLoading = signal(false);

    readonly isLoading = this._isLoading.asReadonly();

    show(): void {
        this._isLoading.set(true);
    }

    dismiss(): void {
        this._isLoading.set(false);
    }
}
