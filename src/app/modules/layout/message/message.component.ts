import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-message',
	templateUrl: './message.component.html',
	styleUrls: ['./message.component.scss'],
})
export class MessageComponent  implements OnInit {
	
	@Input('icon') icon: string;
	@Input('title') title: string;
	@Input('description') description: string;
	
	constructor() { }
	
	ngOnInit() {}
	
}
