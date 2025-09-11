import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    private readonly prefix = 'wizard_';

    save(
        key: string,
        value: string | number | boolean | unknown[] | object,
    ): void {
        const serializedValue =
            typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(this.prefix + key, serializedValue);
    }

    get<T>(key: string): T | null {
        const value = localStorage.getItem(this.prefix + key);
        return value ? JSON.parse(value) : null;
    }

    remove(key: string): void {
        localStorage.removeItem(this.prefix + key);
    }
}
