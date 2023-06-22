import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-game-request-bet',
	templateUrl: './game-request-bet.component.html',
	styleUrls: ['./game-request-bet.component.scss'],
})
export class GameRequestBetComponent  implements OnInit {

	@Input() n: number = 0;

	@Output() onBet = new EventEmitter<number|null>();

	public selected: number|null = null;
	
	constructor() { }
	
	ngOnInit() {}

	public bet() {

		if (this.selected === null) return;

		this.onBet.emit(this.selected);
	}
}
