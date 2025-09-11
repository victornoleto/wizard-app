export interface LoadData<T> {
    loading: boolean;
    error: string | null;
    data: T[];
}
