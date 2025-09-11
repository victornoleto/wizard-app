import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PageIndexCardComponent } from '../page-index-card/page-index-card.component';

@Component({
    selector: 'app-page-form-card',
    imports: [],
    templateUrl: '../page-index-card/page-index-card.component.html',
    styleUrl: '../page-index-card/page-index-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageFormCardComponent extends PageIndexCardComponent {
    override icon = input<string>('fal fa-edit');

    override title = input<string>('Formulário');

    override subtitle = input<string | null>(
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem, laborum.',
    );
}
