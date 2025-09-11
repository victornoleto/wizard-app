import {
    ChangeDetectionStrategy,
    Component,
    input,
    output,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-per-page',
    imports: [ReactiveFormsModule],
    templateUrl: './per-page.component.html',
    styleUrl: './per-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerPageComponent {
    readonly options = input<number[]>([10, 25, 50, 100]);
    readonly value = input<number | undefined>(10);

    readonly update = output<number>();

    protected handleChange(event: Event): void {
        const selectElement = event.target as HTMLSelectElement;
        this.update.emit(Number(selectElement.value));
    }
}
