import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BooleanResponse } from '@app/shared/models/base.model';
import { Filters } from '@app/shared/models/filters.model';
import { LengthAwarePaginator } from '@app/shared/models/pagination.model';
import { Search } from '@app/shared/models/search.model';
import { buildHttpParams } from '@app/shared/utils/http.utils';
import { env } from '@env';
import { map, Observable } from 'rxjs';
import {
    Game,
    GameStoreRequest,
    GameStoreResponse,
    UserCard,
} from './games.model';

@Injectable({
    providedIn: 'root',
})
export class GamesService {
    readonly http = inject(HttpClient);

    public readonly baseUrl = env.url + '/api/games';

    get(search?: Search<Filters>): Observable<LengthAwarePaginator<Game>> {
        return this.http.get<LengthAwarePaginator<Game>>(this.baseUrl, {
            params: buildHttpParams({
                ...(search?.filters || {}),
                ...(search?.pagination || {}),
                ...(search?.sort || {}),
            }),
        });
    }

    store(body: GameStoreRequest): Observable<GameStoreResponse> {
        return this.http.post<GameStoreResponse>(this.baseUrl, body);
    }

    show(id: number): Observable<Game> {
        return this.http.get<Game>(this.baseUrl + '/' + id);
    }

    isAuthPlaying(gameId: number): Observable<boolean> {
        return this.http
            .get<BooleanResponse>(`${this.baseUrl}/${gameId}/is-auth-playing`)
            .pipe(map((response) => response.status));
    }

    cards(gameId: number): Observable<UserCard[]> {
        return this.http.get<UserCard[]>(`${this.baseUrl}/${gameId}/cards`);
    }

    join(gameId: number): Observable<boolean> {
        return this.http
            .post<BooleanResponse>(`${this.baseUrl}/${gameId}/join`, {})
            .pipe(map((response) => response.status));
    }

    start(gameId: number): Observable<boolean> {
        return this.http
            .post<BooleanResponse>(`${this.baseUrl}/${gameId}/start`, {})
            .pipe(map((response) => response.status));
    }

    bet(gameId: number, value: number): Observable<boolean> {
        return this.http
            .post<BooleanResponse>(`${this.baseUrl}/${gameId}/bet`, { value })
            .pipe(map((response) => response.status));
    }

    playCard(gameId: number, cardId: number): Observable<boolean> {
        return this.http
            .post<BooleanResponse>(`${this.baseUrl}/${gameId}/play`, {
                card_id: cardId,
            })
            .pipe(map((response) => response.status));
    }
}
