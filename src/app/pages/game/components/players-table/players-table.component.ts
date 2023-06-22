import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-players-table',
	templateUrl: './players-table.component.html',
	styleUrls: ['./players-table.component.scss'],
})
export class PlayersTableComponent  implements OnInit {

	@Input() players: any[] = [];
	
	constructor() { }
	
	ngOnInit() {}
	
}
