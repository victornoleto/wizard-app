import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'app-page-index-card',
    imports: [],
    templateUrl: './page-index-card.component.html',
    styleUrl: './page-index-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageIndexCardComponent {
    icon = input<string>('fal fa-list');

    title = input<string>('Registros encontrados');

    subtitle = input<string | null>(
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem, laborum.',
    );
}
