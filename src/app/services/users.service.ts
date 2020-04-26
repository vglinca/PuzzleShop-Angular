import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PagedRequest } from '../infrastructure/pagination/paged-request';
import { Observable } from 'rxjs';
import { PagedResponse } from '../infrastructure/pagination/paged-response';
import { UserWithRolesModel } from '../models/users/user-with-roles.model';

@Injectable({
    providedIn: 'root'
})
export class UsersService{

    private baseUrl: string = environment.apiUrl + 'users';
    private headers = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

    constructor(private http: HttpClient){}

    public getPagedUsers(pagedRequest: PagedRequest): Observable<PagedResponse<UserWithRolesModel>>{
        return this.http.post<PagedResponse<UserWithRolesModel>>(`${this.baseUrl}/getPagedUsers`, pagedRequest, this.headers);
    }

    public getUser(userId: number): Observable<UserWithRolesModel>{
        return this.http.get<UserWithRolesModel>(`${this.baseUrl}/${userId}`, this.headers);
    }

    public editRoles(userId: number, roles: Array<string> ){
        return this.http.put(`${this.baseUrl}/manageroles/${userId}`, roles);
    }
}