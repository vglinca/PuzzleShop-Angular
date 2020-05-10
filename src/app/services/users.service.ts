import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PagedRequest } from '../infrastructure/pagination/paged-request';
import { Observable } from 'rxjs';
import { PagedResponse } from '../infrastructure/pagination/paged-response';
import { UserWithRolesModel } from '../models/users/user-with-roles.model';
import { PlainUserModel } from '../models/users/plain-user.model';
import { UserForUpdateModel } from '../models/users/user-for-update.model';

@Injectable({
    providedIn: 'root'
})
export class UsersService{

    private baseUrl: string = environment.apiUrl + 'users';

    constructor(private http: HttpClient){}

    public getPagedUsers(pagedRequest: PagedRequest): Observable<PagedResponse<UserWithRolesModel>>{
        return this.http.post<PagedResponse<UserWithRolesModel>>(`${this.baseUrl}/pagedUsers`, pagedRequest);
    }

    public getUser(userId: number): Observable<UserWithRolesModel>{
        return this.http.get<UserWithRolesModel>(`${this.baseUrl}/${userId}`);
    }

    public getPlainUser(userId: number): Observable<PlainUserModel>{
        return this.http.get<PlainUserModel>(`${this.baseUrl}/plainUser/${userId}`);
    }

    public updateUserProfile(userId: number, model: UserForUpdateModel){
        return this.http.put(`${this.baseUrl}/profile/${userId}`, model);
    }

    public editRoles(userId: number, roles: Array<string> ){
        return this.http.put(`${this.baseUrl}/manageroles/${userId}`, roles);
    }
}