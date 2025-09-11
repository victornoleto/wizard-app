import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Filters } from '@app/shared/models/filters.model';

export interface FilterTag {
    key: string;
    label?: string;
    value: string;
    removable?: boolean;
    visible?: boolean;
    remove: () => void;
}

export type FiltersTagsSetup<T extends Filters = Filters> = {
    [K in keyof T]?: {
        label?: string;
        defaultValue?: T[K] | null;
        value?: (value: T[K] | string | number) => string;
        removable?: boolean;
        visible?: boolean;
        remove?: () => void;
    };
};

@Component({
    selector: 'app-filters-tags',
    imports: [],
    templateUrl: './filters-tags.component.html',
    styleUrl: './filters-tags.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersTagsComponent {
    tags = input<FilterTag[]>([]);

    remove(tag: FilterTag) {
        tag.remove();
    }
}

export function createFiltersTags(
    fg: FormGroup,
    onSubmit: (() => void) | null = null,
    setup: FiltersTagsSetup<Filters>,
): FilterTag[] {
    const tags = [];

    const filters = fg.value as Filters;

    for (const key in filters) {
        const keySetup = setup[key] || {
            label: key,
        };

        const value = filters[key] ?? null;

        const visible = keySetup.visible ?? true;

        if (
            value === null ||
            value === undefined ||
            value === '' ||
            (Array.isArray(value) && value.length === 0) ||
            !visible
        ) {
            continue;
        }

        const remove = () => {
            if (keySetup.remove) {
                keySetup.remove();
            } else {
                fg.get(key)?.setValue(keySetup.defaultValue ?? null);
            }
            onSubmit?.();
        };

        const tag: FilterTag = {
            key,
            label: keySetup.label,
            value: keySetup.value ? keySetup.value(value) : String(value),
            removable: Object.prototype.hasOwnProperty.call(
                keySetup,
                'removable',
            )
                ? keySetup.removable
                : true,
            remove,
        };

        tags.push(tag);
    }

    return tags;
}
