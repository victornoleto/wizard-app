import {
    ChangeDetectionStrategy,
    Component,
    input,
    ViewEncapsulation,
} from '@angular/core';
import { Card } from '../../games.model';

@Component({
    selector: 'app-card',
    imports: [],
    templateUrl: './card.component.html',
    styleUrl: './card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class CardComponent {
    readonly card = input.required<Card>();
    readonly played = input<boolean>(false);
    readonly winning = input<boolean>(false);
}
