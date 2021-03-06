import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AccountService } from '../services/account.service';

@Injectable()
export class AuthGuard implements CanActivate{

    constructor(private accountService: AccountService,
                private router: Router){
        
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if(this.accountService.isAuthenticated()){
            return true;
        }
        this.router.navigate(['home']);
        return false;
    }
}