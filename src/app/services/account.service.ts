import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserForRegistrationModel } from '../models/users/user-for-registration.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserForAuthModel } from '../models/users/user-for-auth.model';
import { BearerToken } from '../models/users/jwt-bearer-token';
import { LoggedInUserInfo } from '../models/users/logged-in-user-info';
import * as jwt_decode from 'jwt-decode';
import * as _ from 'lodash';
import { adminAuthorizeRole, moderatorAuthorizeRole } from '../common/consts/authorize-role';

@Injectable({providedIn: 'root'})
export class AccountService{

    private baseUrl = environment.apiUrl + 'auth';

    constructor(private httpClient: HttpClient){}

    public register(user: UserForRegistrationModel){
        return this.httpClient.post(`${this.baseUrl}/register`, user)
    }

    public login(user: UserForAuthModel): Observable<BearerToken>{
        return this.httpClient.post<BearerToken>(`${this.baseUrl}/authenticate`, user);
    }

    public logout(){
        var headers = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
        return this.httpClient.post(`${this.baseUrl}/logout`, headers);
    }

    public isAuthenticated(): boolean{
        const token = localStorage.getItem(environment.accessToken);
        return token ? true : false;
    }

    public parseToken(): LoggedInUserInfo | null{
        const token = localStorage.getItem(environment.accessToken);
        if(token){
            let decodedToken = jwt_decode(token);
            let loggedInUser: LoggedInUserInfo = new LoggedInUserInfo(); 
            loggedInUser.userId = decodedToken.nameid;
            loggedInUser.email = decodedToken.email;
            loggedInUser.name = decodedToken.unique_name;
            loggedInUser.roles = <Array<string>>decodedToken.role;
            
            return loggedInUser;
        }
    }

    public isInAdminRole(): boolean{
        if(this.isAuthenticated()){
            const userInfo = this.parseToken();
            return [...userInfo.roles].some(r => r === adminAuthorizeRole || r === moderatorAuthorizeRole);
        }else{
            return false;
        }
    }

    public hasNotAdminRole(): boolean{
        if(this.isAuthenticated()){
            const userInfo = this.parseToken();

            return [...userInfo.roles].some(r => r === adminAuthorizeRole) ? false : true;
        }else{
            return false;
        }
    }
}