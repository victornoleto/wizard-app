import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, Router, CanActivateFn } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService {

    constructor(
        private router: Router,
        private authService: AuthService,
        private toastService: ToastService
    ) {
    }

    async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

        const path = window.location.pathname;
        const prefix = `[AUTH-GUARD][${path}]`;

        const status: boolean = await this.authService.isAuthenticate();
        //console.debug(`${prefix} checked = ${status}`);

        if (status === false) {

            this.toastService.show('Você precisa estar logado para acessar essa página!', true, 'top');

            //console.debug(`${prefix} navigating to: ${environment.redirects.guest}`);
            this.router.navigate([environment.redirects.guest]);

        } else {
            //console.debug(`${prefix} continuing...`);
        }

        return status;
    }
}

export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> => {
    return inject(AuthGuardService).canActivate(next, state);
}