import { User } from '@app/core/auth/models/auth.model';
import { Model, StoreResponse } from '@app/shared/models/base.model';

export interface Suit {
    id: number;
    name: string;
    symbol: string;
}

export interface Card {
    id: number;
    suit_id: number;
    name: string;
    value: number;
}

export interface UserCard extends Card {
    played: boolean;
}

export interface Game extends Model {
    creator: User;
    winner: User | null;
    start_match: number;
    max_matches: number;
    end_match: number | null;
    current_match: number;
    current_match_data?: GameMatch | null;
    current_round: number;
    current_round_data?: GameRound | null;
    last_round_data?: GameRound | null;
    next_player_to_bet: User | null;
    next_player_to_play: User | null;
    started_at: Date | null;
    ended_at: Date | null;
    logs?: GameLog[];
    users?: User[];
    joker?: Suit | null;
}

export interface GameRoundPlay {
    user: User;
    card: Card;
    winning?: boolean;
}

export interface GameRoundWinner {
    user: User;
    card: Card;
}

export interface GameRound {
    id: number;
    game_id: number;
    match_id: number;
    match_index: number;
    index: number;
    started_at: Date | null;
    ended_at: Date | null;
    plays: GameRoundPlay[];
    winner?: GameRoundWinner | null;
}

export interface GameMatch {
    id: number;
    game_id: number;
    index: number;
    n: number;
    joker_suit_id: number;
    created_at: Date;
    started_at: Date | null;
    ended_at: Date | null;
}

export interface GameLog {
    id: number;
    game_id: number;
    message: string;
    created_at: Date;
}

export interface GameMatchBet {
    id: number;
    match_id: number;
    user_id: number;
    value: number;
    created_at: Date;
}

export interface GameStoreRequest {
    start_match: number;
    max_matches: number;
}

export interface GamePoint {
    user: User;
    points: number;
}

export type GameStoreResponse = StoreResponse<Game>;

export interface GameMatchCreatedEvent {
    game: Game;
    joker: Suit;
    match: GameMatch;
}

export interface GameMatchEndedEvent {
    match: GameMatch;
    users: User[];
}

export interface GameWinnerEvent {
    user: User;
    points: number;
}
