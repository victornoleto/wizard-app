import { FormGroup } from '@angular/forms';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.scss'],
})
export class FormComponent  implements OnInit {

	@Input('fg') fg: FormGroup;
	@Output('onSubmit') onSubmit = new EventEmitter();
	@Input('btnSubmit') btnSubmit: HTMLButtonElement;
	
	constructor(
		private el: ElementRef
	) { }
	
	ngOnInit() {

		if (!this.btnSubmit) {

			let form = this.el.nativeElement;

			let buttonSubmit = form.querySelector('button[type="submit"]');

			if (buttonSubmit) {
				this.btnSubmit = buttonSubmit;
			}
		}
	}
}
