import { Injectable, signal, TemplateRef } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class HeaderContentService {
    private readonly _customContent = signal<TemplateRef<unknown> | null>(null);

    readonly customContent = this._customContent.asReadonly();

    setCustomContent(template: TemplateRef<unknown> | null): void {
        this._customContent.set(template);
    }

    clearCustomContent(): void {
        this._customContent.set(null);
    }
}
