import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-form-checkbox-list',
	templateUrl: './form-checkbox-list.component.html',
	styleUrls: ['./form-checkbox-list.component.scss'],
})
export class FormCheckboxListComponent  implements OnInit {

	@Input('gap') gap: number = 2;
	
	constructor() { }
	
	ngOnInit() {}
}
