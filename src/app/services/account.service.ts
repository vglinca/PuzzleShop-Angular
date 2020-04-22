import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserForRegistrationModel } from '../models/users/user-for-registration.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AccountService{

    private baseUrl = environment.apiUrl + 'auth';

    constructor(private httpClient: HttpClient){}

    register(user: UserForRegistrationModel){
        var headers = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
        return this.httpClient.post(`${this.baseUrl}/register`, user, headers)
            // .pipe(catchError(err => this.handleHttpError(err)));
    }

    // private handleHttpError(err: HttpErrorResponse){
    //     return throwError(err);
    // }
}