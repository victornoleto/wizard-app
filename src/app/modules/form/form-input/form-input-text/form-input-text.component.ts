import { Component, Input, OnInit } from '@angular/core';

import { FormInput } from './../form-input';

@Component({
	selector: 'app-form-input-text',
	templateUrl: './form-input-text.component.html',
	styleUrls: ['../../form.scss'],
})
export class FormInputTextComponent extends FormInput {

	@Input('type') type: string = 'text';
	@Input('minlength') minlength: number;
	@Input('maxlength') maxlength: number;
	@Input('autocapitalize') autocapitalize: boolean = false;
}
