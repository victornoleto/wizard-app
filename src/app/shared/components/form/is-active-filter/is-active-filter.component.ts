import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { CheckboxComponent } from '../checkbox/checkbox.component';

interface StatusOption {
    value: boolean | null;
    label: string;
}

@Component({
    selector: 'app-is-active-filter',
    imports: [CheckboxComponent],
    templateUrl: './is-active-filter.component.html',
    styleUrl: './is-active-filter.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsActiveFilterComponent {
    fc = input.required<AbstractControl>();

    id = input<string>('is-active');

    protected readonly options: StatusOption[] = [
        { value: null, label: 'Exibir todos os registros' },
        { value: true, label: 'Apenas ativos' },
        { value: false, label: 'Apenas inativos' },
    ];
}
