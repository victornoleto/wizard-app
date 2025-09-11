import { JsonPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    input,
    output,
} from '@angular/core';
import { Card, UserCard } from '@app/feature/games/games.model';
import { CardComponent } from './../../../../components/card/card.component';

@Component({
    selector: 'app-game-user-cards',
    imports: [CardComponent, JsonPipe],
    templateUrl: './game-user-cards.component.html',
    styleUrl: './game-user-cards.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameUserCardsComponent {
    readonly cards = input.required<UserCard[]>();

    play = output<Card>();
}
