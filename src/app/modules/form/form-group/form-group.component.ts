import { Component, HostBinding, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'app-form-group',
	templateUrl: './form-group.component.html',
	styleUrls: ['./form-group.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class FormGroupComponent  implements OnInit {

	@Input('name') name: string;
	@Input('label') label: string = '';
	@Input('description') description: string = '';
	@Input('required') required: boolean = false;

	@HostBinding('attr.data-for') for = '';
	
	constructor() { }
	
	ngOnInit() {
		this.for = this.name;
	}
}
