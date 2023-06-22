import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-game-my-cards',
	templateUrl: './game-my-cards.component.html',
	styleUrls: ['./game-my-cards.component.scss'],
})
export class GameMyCardsComponent  implements OnInit {

	@Input() cards: any[] = [];

	@Output() onCardClick = new EventEmitter<any>();
	
	constructor() { }
	
	ngOnInit() {}
	
}
