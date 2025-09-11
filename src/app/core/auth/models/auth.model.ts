import { Model } from '@app/shared/models/base.model';

export interface UserPivot {
    user_id?: number;
    current_bet?: number | null;
    game_id?: number;
    index?: number;
    points?: number | null;
    rounds_won?: number | null;
}

export interface User extends Model {
    username: string;
    name: string;
    email: string;
    group_id: number;
    pivot?: UserPivot;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}
