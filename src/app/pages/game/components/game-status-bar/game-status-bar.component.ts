import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-game-status-bar',
	templateUrl: './game-status-bar.component.html',
	styleUrls: ['./game-status-bar.component.scss'],
})
export class GameStatusBarComponent  implements OnInit {

	@Input() message: string;
	@Input() highlight: boolean;
	
	constructor() { }
	
	ngOnInit() {}
	
}
