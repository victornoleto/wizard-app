import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GamesPageRoutingModule } from './games-routing.module';
import { GamesPage } from './games.page';
import { LayoutModule } from 'src/app/modules/layout/layout.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		GamesPageRoutingModule,
		LayoutModule
	],
	declarations: [GamesPage]
})
export class GamesPageModule {}
