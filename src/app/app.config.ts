import {
    provideHttpClient,
    withFetch,
    withInterceptors,
} from '@angular/common/http';
import {
    ApplicationConfig,
    inject,
    provideAppInitializer,
    provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { provideHotToastConfig } from '@ngxpert/hot-toast';

import { routes } from './app.routes';
import { AuthService } from './core/auth/services/auth.service';
import { ApiInterceptor } from './core/interceptors/api.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes, withComponentInputBinding()),
        provideHttpClient(withFetch(), withInterceptors([ApiInterceptor])),
        provideAppInitializer(async () => {
            return inject(AuthService).isAuthenticated();
        }),
        provideHotToastConfig({
            stacking: 'vertical',
            visibleToasts: 3,
            dismissible: true,
            duration: 3500,
            autoClose: true,
        }),
    ],
};
