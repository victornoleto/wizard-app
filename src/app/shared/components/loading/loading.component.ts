import { Component, input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-loading',
    imports: [],
    templateUrl: './loading.component.html',
    styleUrl: './loading.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class LoadingComponent {
    public message = input<string | null>(null);
    public size = input<'sm' | 'md' | 'lg'>('md');
}
