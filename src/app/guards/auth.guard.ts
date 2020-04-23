import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AccountService } from '../services/account.service';

@Injectable()
export class AuthGuard implements CanActivate{

    constructor(private accountService: AccountService){
        
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if(this.accountService.isAuthenticated() && this.accountService.isInAdminRole()){
            return true;
        }
        return false;
    }
}