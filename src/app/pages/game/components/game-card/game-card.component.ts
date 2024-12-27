import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'app-game-card',
	templateUrl: './game-card.component.html',
	styleUrls: ['./game-card.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class GameCardComponent  implements OnInit {

	@Input() card: any;
	@Input() winning: boolean = false;

	@Output() onClick = new EventEmitter<any>();
	
	constructor() { }
	
	ngOnInit() {}
	
}
