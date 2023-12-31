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
		path: 'auth',
		canActivateChild: [GuestGuard],
		children: [
			{
				path: 'login',
				loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
			},
			/* {
				path: 'register',
				loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
			}, */
			{
				path: '',
				redirectTo: 'login',
				pathMatch: 'full'
			},
		]
	},
	{
		path: 'app',
		canActivateChild: [AuthGuard],
		children: [
			{
				path: 'games',
				loadChildren: () => import('./pages/games/games.module').then( m => m.GamesPageModule)
			},
			{
				path: 'game/create',
				loadChildren: () => import('./pages/game-create/game-create.module').then( m => m.GameCreatePageModule)
			},
			{
				path: 'game/:id',
				loadChildren: () => import('./pages/game/game.module').then( m => m.GamePageModule)
			},
			{
				path: '',
				redirectTo: 'games',
				pathMatch: 'full'
			}
		]
	},
	{
		path: '',
		redirectTo: 'auth',
		pathMatch: 'full'
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }
