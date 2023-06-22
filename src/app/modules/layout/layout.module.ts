import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { HeaderComponent } from './header/header.component';
import { BodyComponent } from './body/body.component';
import { FooterComponent } from './footer/footer.component';
import { MessageComponent } from './message/message.component';

let exports = [
	HeaderComponent,
	BodyComponent,
	FooterComponent,
	MessageComponent,
];

@NgModule({
	exports,
	declarations: exports,
	imports: [
		CommonModule,
		IonicModule,
		RouterModule
	]
})
export class LayoutModule { }