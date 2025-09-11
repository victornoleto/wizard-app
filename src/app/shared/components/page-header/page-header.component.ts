import {
    Component,
    input,
    contentChild,
    ElementRef,
    signal,
    effect,
} from '@angular/core';

@Component({
    selector: 'app-page-header',
    imports: [],
    templateUrl: './page-header.component.html',
    styleUrl: './page-header.component.scss',
})
export class PageHeaderComponent {
    readonly title = input.required<string>();
    readonly subtitle = input<string | null>(null);

    private readonly controlsContent = contentChild<ElementRef>('controls');
    protected readonly hasControls = signal(false);

    constructor() {
        effect(() => {
            const controls = this.controlsContent();
            this.hasControls.set(!!controls);
        });
    }
}
