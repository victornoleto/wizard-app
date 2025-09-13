import { Filters, FilterValue } from '../models/filters.model';

export function convertCamelToSnakeCase(key: string): string {
    return key.replace(/([A-Z])/g, '_$1').toLowerCase();
}

export function filterValidProperties(filters: Filters): Filters {
    const result: Filters = {};

    for (const [key, value] of Object.entries(filters)) {
        if (isValidValue(value)) {
            const snakeKey = convertCamelToSnakeCase(key);
            result[snakeKey] = value;
        }
    }

    return result;
}

function isValidValue(value: FilterValue | FilterValue[] | undefined): boolean {
    // Filtrar null, undefined e string vazia
    if (value === null || value === undefined || value === '') {
        return false;
    }

    // Se for array, não pode ser vazio
    if (Array.isArray(value)) {
        return value.length > 0;
    }

    return true;
}

export function az09_(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '')
        .replace(/__+/g, '_')
        .replace(/^_+|_+$/g, '');
}
