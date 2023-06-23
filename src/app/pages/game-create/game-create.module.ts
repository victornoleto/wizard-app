import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GameCreatePageRoutingModule } from './game-create-routing.module';
import { GameCreatePage } from './game-create.page';
import { LayoutModule } from 'src/app/modules/layout/layout.module';
import { AppFormModule } from 'src/app/modules/form/form.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		GameCreatePageRoutingModule,
		LayoutModule,
		AppFormModule
	],
	declarations: [GameCreatePage]
})
export class GameCreatePageModule {}
