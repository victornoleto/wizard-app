import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-game-log',
	templateUrl: './game-log.component.html',
	styleUrls: ['./game-log.component.scss'],
})
export class GameLogComponent  implements OnInit {

	@Input() logs: any[] = [
		{
			'created_at': '2023-06-21 10:10:00',
			'message': 'Hello World'
		}
	];
	
	constructor() { }
	
	ngOnInit() {}
	
}
