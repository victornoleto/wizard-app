import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { FormComponent } from './form/form.component';
import { FormGroupComponent } from './form-group/form-group.component';
import { FormInputTextComponent } from './form-input/form-input-text/form-input-text.component';
import { FormInputDateComponent } from './form-input/form-input-date/form-input-date.component';
import { FormDirective } from './form.directive';
import { FormCheckboxComponent } from './form-checkbox/form-checkbox.component';
import { FormInputNumberComponent } from './form-input/form-input-number/form-input-number.component';
import { FormSelectComponent } from './form-select/form-select/form-select.component';
import { FormCheckboxListComponent } from './form-checkbox-list/form-checkbox-list.component';
import { FormInputPasswordComponent } from './form-input/form-input-password/form-input-password.component';

let exports = [
	FormDirective,
	FormComponent,
	FormGroupComponent,
	FormInputTextComponent,
	FormInputNumberComponent,
	FormInputPasswordComponent,
	FormInputDateComponent,
	FormCheckboxComponent,
	FormCheckboxListComponent,
	FormSelectComponent,
];

@NgModule({
	exports,
	declarations: exports,
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ReactiveFormsModule,
	]
})
export class AppFormModule { }
