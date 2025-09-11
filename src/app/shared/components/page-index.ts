import {
    computed,
    effect,
    inject,
    OnDestroy,
    signal,
    WritableSignal,
} from '@angular/core';
import { DialogService } from '../services/dialog.service';

import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DEFAULT_SORT, TableSort } from '../directives';
import { DeleteResponse, Model } from '../models/base.model';
import { Filters } from '../models/filters.model';
import {
    DEFAULT_PAGINATION,
    LengthAwarePaginator,
    Paginator,
} from '../models/pagination.model';
import { Search } from '../models/search.model';
import { LoadingService } from '../services/loading.service';
import { ToastService } from '../services/toast.service';
import { getErrorMessage } from '../utils/http.utils';
import { FilterTag } from './filters-tags/filters-tags.component';

@Component({
    template: '',
})
export abstract class PageIndex implements OnDestroy {
    // Services commonly used in page index components
    protected readonly dialogService = inject(DialogService);
    protected readonly toastService = inject(ToastService);
    protected readonly loadingService = inject(LoadingService);

    // Subject to cancel previous requests
    private readonly cancelPreviousRequest$ = new Subject<void>();

    // Core signals
    protected readonly sort = signal<TableSort>(DEFAULT_SORT);
    protected readonly pagination = signal<Paginator>(DEFAULT_PAGINATION);
    protected readonly isLoading = signal<boolean>(false);
    protected readonly error = signal<string | null>(null);
    protected readonly filtersTags = signal<FilterTag[]>([]);

    // Abstract signals
    protected abstract readonly filters: WritableSignal<Filters | null>;
    protected abstract readonly records: WritableSignal<
        LengthAwarePaginator<unknown> | unknown[]
    >;

    protected readonly search = computed<Search<Filters> | null>(() => {
        const filters = this.filters();
        if (filters) {
            return {
                sort: this.sort(),
                pagination: this.pagination(),
                filters,
            };
        }
        return null;
    });

    constructor() {
        effect(() => {
            this.refresh();
        });
    }

    ngOnDestroy(): void {
        this.cancelPreviousRequest$.next();
        this.cancelPreviousRequest$.complete();
    }

    refresh(): void {
        const search = this.search();

        if (!search) {
            return;
        }

        this.cancelPreviousRequest$.next();

        this.isLoading.set(true);

        const observable = this.searchObservable(search);

        observable
            .subscribe({
                next: (response: LengthAwarePaginator<unknown> | unknown[]) => {
                    this.error.set(null);
                    this.records?.set(response);
                },
                error: (err) => {
                    this.error.set(getErrorMessage(err));
                },
            })
            .add(() => {
                this.isLoading.set(false);
            });
    }

    onDelete(record: Model): void {
        const observable = this.deleteObservable?.(record);

        if (!observable) {
            return;
        }

        this.isLoading.set(true);

        observable.subscribe({
            next: () => {
                this.refresh();
            },
            error: (error) => {
                this.isLoading.set(false);
                this.dialogService.error({
                    message: 'Não foi possível remover o registro.',
                    error,
                    tryAgain: () => this.onDelete(record),
                });
            },
        });
    }

    onFiltersChange(filters: Filters): void {
        this.filters.set(filters);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    deleteObservable(record: Model): Observable<DeleteResponse> | null {
        return null;
    }

    abstract searchObservable(
        search: Search<Filters>,
    ): Observable<LengthAwarePaginator<unknown> | unknown[]>;
}
