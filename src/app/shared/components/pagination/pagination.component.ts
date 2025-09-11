import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    model,
} from '@angular/core';
import { PerPageComponent } from '@app/shared/components/form/per-page/per-page.component';
import {
    LengthAwarePaginator,
    Paginator,
} from '@app/shared/models/pagination.model';

@Component({
    selector: 'app-pagination',
    imports: [PerPageComponent],
    templateUrl: './pagination.component.html',
    styleUrl: './pagination.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
    readonly collection = input.required<LengthAwarePaginator<unknown>>();
    readonly pagination = model.required<Paginator>();

    // Atalhos
    readonly currentPage = computed(() => this.collection().current_page);
    readonly perPage = computed(() => this.collection().perPage);
    readonly total = computed(() => this.collection().total);
    readonly from = computed(() => this.collection().from);
    readonly to = computed(() => this.collection().to);
    readonly links = computed(() => this.collection().links);

    protected onPerPageChanged(value: number): void {
        this.pagination.update((current) => ({ ...current, perPage: value }));
    }

    protected onPageChanged(page: string | number): void {
        this.pagination.update((current) => ({
            ...current,
            page: Number(page),
        }));
    }
}
