import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Filters } from '../models/filters.model';
import { filterValidProperties } from './map.utils';

export function buildHttpParams(params: Filters): HttpParams {
    const validParams = filterValidProperties(params);

    // Constrói HttpParams manualmente para lidar com arrays
    let httpParams = new HttpParams();

    Object.entries(validParams).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach((item) => {
                httpParams = httpParams.append(key + '[]', String(item));
            });
        } else {
            httpParams = httpParams.append(key, String(value));
        }
    });

    return httpParams;
}

export function getErrorMessage(error: HttpErrorResponse): string {
    let message =
        error.error?.message ||
        error.error?.error ||
        error.message ||
        error.status + ' ' + error.statusText;

    if (message.includes('Pusher error: cURL error 7: Failed to connect')) {
        message = 'Não foi possível se conectar com o servidor websocket.';
    }

    return message;
}
