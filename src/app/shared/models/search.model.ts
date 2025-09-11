import { TableSort } from '@app/shared/directives';
import { Paginator } from './pagination.model';

export interface Search<Filters> {
    sort?: TableSort;
    pagination?: Paginator;
    filters?: Filters;
}
