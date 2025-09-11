import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    linkedSignal,
    output,
} from '@angular/core';
import { Filters } from '@app/shared/models/filters.model';
import { filterValidProperties } from '@app/shared/utils/map.utils';

@Component({
    selector: 'app-btn-open-filters',
    imports: [],
    templateUrl: './btn-open-filters.component.html',
    styleUrl: './btn-open-filters.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtnOpenFiltersComponent {
    filters = input<Filters | null>(null);

    open = output<void>();

    validFilters = linkedSignal(() => {
        return filterValidProperties(this.filters() || {});
    });

    totalAppliedFilters = computed(() => {
        return Object.keys(this.validFilters()).length;
    });
}
