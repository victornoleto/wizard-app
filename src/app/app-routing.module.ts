import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { GuestGuard } from './guards/guest.guard';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
	{
		path: 'home',
		loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
	},
	{
		path: '',
		redirectTo: 'login',
		pathMatch: 'full'
	},
	{
		path: 'login',
		canActivate: [GuestGuard],
		loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
	},
	{
		path: 'register',
		canActivate: [GuestGuard],
		loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
	},
	{
		path: 'games',
		canActivate: [AuthGuard],
		loadChildren: () => import('./pages/games/games.module').then( m => m.GamesPageModule)
	},
	{
		path: 'game/:id',
		canActivate: [AuthGuard],
		loadChildren: () => import('./pages/game/game.module').then( m => m.GamePageModule)
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }
