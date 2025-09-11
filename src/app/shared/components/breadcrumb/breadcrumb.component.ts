import { Component, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

export interface BreadcrumbItem {
    label: string;
    link?: string;
    disabled?: boolean;
    children?: BreadcrumbItem[];
}

@Component({
    selector: 'app-breadcrumb',
    imports: [RouterLink, NgbDropdownModule],
    templateUrl: './breadcrumb.component.html',
    styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent {
    readonly rawItems = input.required<BreadcrumbItem[]>({
        alias: 'items',
    });

    readonly showHome = input<boolean>(true);

    readonly items = linkedSignal(() => {
        let items = this.rawItems().slice();

        if (this.showHome()) {
            items.unshift({ label: 'Home', link: '/' });
        }

        if (items.length > 5) {
            items = [
                items[0],
                {
                    label: '...',
                    children: items.slice(1, -2),
                },
                ...items.slice(-2),
            ];
        }

        return items;
    });
}
