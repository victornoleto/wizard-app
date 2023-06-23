import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-joker-card',
	templateUrl: './joker-card.component.html',
	styleUrls: ['./joker-card.component.scss'],
})
export class JokerCardComponent  implements OnInit {

	@Input() joker: any;
	
	constructor() { }
	
	ngOnInit() {
	}
}
