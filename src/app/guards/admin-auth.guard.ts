import { Injectable } from '@angular/core';
import { AccountService } from '../services/account.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';


@Injectable()
export class AdminAuthGuard {
    constructor(private accountService: AccountService,
        private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.accountService.isAuthenticated() && this.accountService.isInAdminRole()) {
            return true;
        }
        this.router.navigate(['home']);
        return false;
    }
}