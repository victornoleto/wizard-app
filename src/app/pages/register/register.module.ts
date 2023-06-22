import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterPageRoutingModule } from './register-routing.module';
import { RegisterPage } from './register.page';
import { AppFormModule } from 'src/app/modules/form/form.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RegisterPageRoutingModule,
		AppFormModule
	],
	declarations: [RegisterPage]
})
export class RegisterPageModule {}
