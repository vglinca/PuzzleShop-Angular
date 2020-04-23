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

@Injectable({providedIn: 'root'})
export class AccountService{

    private baseUrl = environment.apiUrl + 'auth';

    constructor(private httpClient: HttpClient){}

    public register(user: UserForRegistrationModel){
        var headers = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
        return this.httpClient.post(`${this.baseUrl}/register`, user, headers)
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
            // debugger;
            // let userInfo: LoggedInUserInfo = new LoggedInUserInfo();
            const userInfo = this.parseToken();
            // console.log('USERINFO: ', userInfo.roles);
            // let roles: Array<string> = new Array<string>();
            // [...userInfo.roles].forEach(r => {
            //     roles.push(r);
            // });
            
            console.log([...userInfo.roles]);
            console.log([...userInfo.roles].some(r => r === "admin" || r === "moderator"));
            return [...userInfo.roles].some(r => r === "admin" || r === "moderator");
        }else{
            return false;
        }
    }
}