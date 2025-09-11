import {
    Component,
    inject,
    model,
    ModelSignal,
    OnInit,
    Signal,
    signal,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Filters } from '@app/shared/models/filters.model';
import {
    createFiltersTags,
    FiltersTagsSetup,
    FilterTag,
} from '../filters-tags/filters-tags.component';
import { FiltersModalComponent } from './filters-modal.component';

@Component({
    template: '',
})
export abstract class FiltersComponent<T extends Filters> implements OnInit {
    protected readonly fb = inject(FormBuilder);

    readonly tags = model<FilterTag[]>([], {
        alias: 'tags',
    });

    protected readonly formSubmitted = signal<boolean>(false);
    protected readonly submitOnInit: boolean = true;

    // Abstract properties
    protected abstract readonly modal: Signal<
        FiltersModalComponent | undefined
    >;
    protected abstract readonly filters: ModelSignal<T | null>;
    protected abstract readonly form: FormGroup;

    ngOnInit(): void {
        /* setTimeout(() => {
            this.open();
        }); */

        this.onClear(); // Reset form to initial values
        if (this.submitOnInit) {
            this.onSubmit();
        }
    }

    initialValue(): T {
        return {} as T;
    }

    open(): void {
        console.debug('FiltersComponent.open', this.modal());
        this.modal()?.open();
    }

    onSubmit(): void {
        this.formSubmitted.set(true);

        if (!this.form.valid) {
            return;
        }

        const value = this.form.value as T;
        this.filters.set(value);
        this.updateTags();
        this.modal()?.close();
    }

    onClear(): void {
        this.formSubmitted.set(false);
        this.form.reset(this.initialValue());
    }

    onCancel(): void {
        this.formSubmitted.set(false);
        this.form.reset(this.filters());
    }

    updateTags(): void {
        const setup = this.tagsSetup();

        this.tags.set(
            createFiltersTags(this.form, this.onSubmit.bind(this), setup ?? {}),
        );
    }

    tagsSetup(): FiltersTagsSetup | null {
        return null;
    }
}
