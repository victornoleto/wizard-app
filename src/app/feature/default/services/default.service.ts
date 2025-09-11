import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DefaultService {
    private readonly http = inject(HttpClient);
}
