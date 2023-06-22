import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'app-game-round-data',
	templateUrl: './game-round-data.component.html',
	styleUrls: ['./game-round-data.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class GameRoundDataComponent  implements OnInit {
	
	@Input() data: any;
	@Input() message: string;
	
	constructor() { }
	
	ngOnInit() {}
	
}
