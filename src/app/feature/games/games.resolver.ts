import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Game, UserCard } from './games.model';
import { GamesService } from './games.service';

export const gameResolver: ResolveFn<Game> = (route) => {
    return inject(GamesService).show(route.params['id']);
};

export const isAuthPlayingResolver: ResolveFn<boolean> = (route) => {
    return inject(GamesService).isAuthPlaying(route.params['id']);
};

export const userCardsResolver: ResolveFn<UserCard[]> = (route) => {
    return inject(GamesService).cards(route.params['id']);
};
