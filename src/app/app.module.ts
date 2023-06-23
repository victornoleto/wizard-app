import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { SwiperModule } from 'swiper/angular';

import { AppComponent, checkStorageAuthentication } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './services/auth.service';
import { StorageService } from './services/storage.service';

@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		BrowserModule,
		IonicModule.forRoot(),
		AppRoutingModule,
		HttpClientModule,
		SwiperModule
	],
	providers: [
		{
			provide: RouteReuseStrategy,
			useClass: IonicRouteStrategy
		},
		{
            provide: APP_INITIALIZER,
            useFactory: checkStorageAuthentication,
            deps: [AuthService, StorageService],
            multi: true
        },
		Storage
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule {}
