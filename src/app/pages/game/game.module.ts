import { GameCardComponent } from './components/game-card/game-card.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GamePageRoutingModule } from './game-routing.module';
import { GamePage } from './game.page';
import { LayoutModule } from 'src/app/modules/layout/layout.module';
import { PlayersTableComponent } from './components/players-table/players-table.component';
import { GameLogComponent } from './components/game-log/game-log.component';
import { DatePipeModule } from 'src/app/pipes/date/date-pipe.module';
import { UcfirstPipeModule } from 'src/app/pipes/ucfirst/ucfirst.module';
import { GameMyCardsComponent } from './components/game-my-cards/game-my-cards.component';
import { GameRequestBetComponent } from './components/game-request-bet/game-request-bet.component';
import { GameStatusBarComponent } from './components/game-status-bar/game-status-bar.component';
import { GameRoundDataComponent } from './components/game-round-data/game-round-data.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		GamePageRoutingModule,
		LayoutModule,
		DatePipeModule,
		UcfirstPipeModule
	],
	declarations: [
		GamePage,
		PlayersTableComponent,
		GameLogComponent,
		GameMyCardsComponent,
		GameCardComponent,
		GameRequestBetComponent,
		GameStatusBarComponent,
		GameRoundDataComponent
	]
})
export class GamePageModule {}
