import { Component, Input } from '@angular/core';
import { FormInput } from '../form-input';

@Component({
  selector: 'app-form-input-password',
  templateUrl: './form-input-password.component.html',
  styleUrls: ['../../form.scss'],
})
export class FormInputPasswordComponent extends FormInput {

	public type: string = 'password';

	@Input('minlength') minlength: number = 8;
	@Input('maxlength') maxlength: number;
}