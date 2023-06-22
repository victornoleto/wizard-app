import { Component, Input, OnInit } from '@angular/core';
import { FormInput } from '../form-input';

@Component({
	selector: 'app-form-input-number',
	templateUrl: './form-input-number.component.html',
	styleUrls: ['../../form.scss'],
})
export class FormInputNumberComponent extends FormInput {
	
	@Input('min') min: number;
	@Input('max') max: number;
}
