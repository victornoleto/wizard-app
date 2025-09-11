import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    input,
    signal,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';

export type DefaultCheckboxValue = 1 | null;
export type CheckboxValue = string | number | null | boolean;

@Component({
    selector: 'app-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrl: './checkbox.component.scss',
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent {
    fc = input.required<AbstractControl>();
    id = input<string>();
    value = input<CheckboxValue | CheckboxValue[] | null>(1);
    name = input<string>();
    disabled = input<boolean>(false);
    type = input<'checkbox' | 'radio'>('checkbox');

    finalId = computed(() => this.id() || `checkbox-${uuidv4()}`);
    finalName = computed(() => this.name() || 'checkbox-' + this.finalId());

    fcValue = signal<CheckboxValue | CheckboxValue[] | null>(null);

    isChecked = computed(() => {
        const fcVal = this.fcValue();
        const val = this.value();

        if (Array.isArray(fcVal) && !Array.isArray(val)) {
            return fcVal.includes(val);
        }

        return fcVal === val;
    });

    isDisabled = signal<boolean>(false);

    constructor() {
        effect(() => {
            this.initialize();
        });
    }

    onChange(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        const value = this.value();
        const fcValue = this.fcValue();

        if (Array.isArray(fcValue) && !Array.isArray(value)) {
            if (inputElement.checked) {
                this.fc().setValue([...fcValue, value]);
            } else {
                this.fc().setValue(fcValue.filter((v) => v !== value));
            }
        } else {
            this.fc().setValue(inputElement.checked ? value : null);
        }
    }

    private initialize(): void {
        const fc = this.fc();

        if (!fc) {
            return;
        }

        this.fc().valueChanges.subscribe((value) => {
            this.fcValue.set(value);
        });

        this.fc().statusChanges.subscribe((status) => {
            this.isDisabled.set(status === 'DISABLED');
        });

        this.fcValue.set(fc.value);
        this.isDisabled.set(fc.disabled);
    }
}
