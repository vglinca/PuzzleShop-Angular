import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PlainUserModel } from '../models/users/plain-user.model';
import { UsersService } from '../services/users.service';
import { AccountService } from '../services/account.service';

@Injectable({ providedIn: 'root' })
export class UserInfoResolver implements Resolve<PlainUserModel> {
    constructor(private userService: UsersService,
                private accountService: AccountService){}
    resolve(route: ActivatedRouteSnapshot): Observable<PlainUserModel> | Promise<PlainUserModel> | PlainUserModel {
        let userId: number = this.accountService.parseToken().userId;
        return this.userService.getPlainUser(userId);
    }
}