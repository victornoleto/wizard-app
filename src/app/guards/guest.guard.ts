import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateFn } from '@angular/router';

import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class GuestGuardsService  {

    constructor(
        private router: Router,
        private authService: AuthService
    ) {
    }

    async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

        const path = window.location.pathname;
        const prefix = `[GUEST-GUARD][${path}]`;

        const status: boolean = await this.authService.isAuthenticate();
        //console.debug(`${prefix} checked = ${!status}`);

        if (!status === false) {
            //console.debug(`${prefix} navigating to: ${environment.redirects.auth}`);
            this.router.navigate([environment.redirects.auth]);

        } else {
            //console.debug(`${prefix} continuing...`);
        }

        return !status;
    }
}

export const GuestGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> => {
    return inject(GuestGuardsService).canActivate(next, state);
}