export interface Model {
    id: number;
    created_at: Date;
    updated_at: Date;
}

export interface StoreResponse<T> {
    message: string;
    data: T;
}

export type UpdateResponse<T> = StoreResponse<T>;

export interface DeleteResponse {
    message: string;
}

export interface BooleanResponse {
    status: boolean;
}
