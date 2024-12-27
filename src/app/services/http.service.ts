import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    private timeout: number = 60 * 1000;
    
    private token: string = '';

    constructor(
        private http: HttpClient,
        private storageService: StorageService
    ) { }

    public setToken(token: string): void {

        this.token = token;
        
        this.storageService.set('token', token);
    }

    public createToken(username: string, password: string) {

        let credentials = `${username}:${password}`;

        /* let hash = btoa(credentials);

        let token = `Basic ${hash}`; */

        let token = credentials;

        this.setToken(token);
    }

    public get(uri: string, query: any = {}, options: any = {}, headers: any = {}): Observable<any> {

        let requestConfig = this.getConfig(query, options, headers);

        let url = environment.url + uri;

        let r = this.http.get(url, requestConfig);

        r = r.pipe(timeout(this.timeout));

        return r;
    }

    public post(uri: string, body: any = {}, options: any = {}, headers: any = {}): Observable<any> {

        let requestConfig = this.getConfig(null, options, headers);

        let url = environment.url + uri;

        let r = this.http.post(url, body, requestConfig);

        r = r.pipe(timeout(this.timeout));

        return r;
    }

    public put(uri: string, body: any = {}, options: any = {}, headers: any = {}): Observable<any> {

        let requestConfig = this.getConfig(null, options, headers);

        let url = environment.url + uri;

        let r = this.http.put(url, body, requestConfig);

        r = r.pipe(timeout(this.timeout));

        return r;
    }

    public delete(uri: string, query: any = {}, options: any = {}, headers: any = {}): Observable<any> {

        let requestConfig = this.getConfig(query, options, headers);

        let url = environment.url + uri;

        let r = this.http.delete(url, requestConfig);

        r = r.pipe(timeout(this.timeout));

        return r;
    }

    private getConfig(query: any = {}, options: any = {}, headers: any = {}): any {

        if (this.token) {
			headers.Authorization = this.token;
		}

        let config: any = {
            headers: new HttpHeaders(headers)
        };

        if (query) {

            config.params = new HttpParams();

			Object.keys(query).forEach(key => {
                
                if (query[key] !== '' && query[key] !== null && query[key] !== undefined) {
                    config.params = config.params.set(key, query[key]);
                }

			});
        }

        // Configurações adicionais
        Object.assign(config, options);

        return config;
    }
}
