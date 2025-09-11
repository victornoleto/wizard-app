import {
    ChangeDetectionStrategy,
    Component,
    input,
    linkedSignal,
    WritableSignal,
} from '@angular/core';
import { BreadcrumbItem } from '@app/shared/components/breadcrumb/breadcrumb.component';
import { PageHeaderControlsComponent } from '@app/shared/components/page-header-controls/page-header-controls.component';
import { PageHeaderComponent } from '@app/shared/components/page-header/page-header.component';

@Component({
    selector: 'app-games-page-header',
    imports: [PageHeaderComponent, PageHeaderControlsComponent],
    templateUrl: './games-page-header.component.html',
    styleUrl: './games-page-header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamesPageHeaderComponent {
    title = input<string>('Jogos');

    subtitle = input<string | null>(null);

    mainBreadcrumbLink = input<boolean>(false);

    partialBreadcrumb = input<BreadcrumbItem[]>([], {
        alias: 'breadcrumb',
    });

    breadcrumb: WritableSignal<BreadcrumbItem[]> = linkedSignal(() => {
        const base: BreadcrumbItem[] = [
            //{ label: 'Cadastros' },
            {
                label: 'Games',
                link: this.mainBreadcrumbLink() ? '/users' : undefined,
            },
        ];
        return [...base, ...(this.partialBreadcrumb() || [])];
    });
}
