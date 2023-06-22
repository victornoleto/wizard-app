import { Component, Input } from '@angular/core';

import { FormInput } from '../form-input';

@Component({
	selector: 'app-form-input-date',
	templateUrl: './form-input-date.component.html',
	styleUrls: ['../../form.scss'],
})
export class FormInputDateComponent extends FormInput {
	
	@Input('min') min: string;
	@Input('max') max: string;
}