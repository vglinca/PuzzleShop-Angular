import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { PuzzleTypeModel } from '../models/puzzle-types/puzzle-type.model';
import { catchError } from 'rxjs/operators';
import { handleError } from '../common/handleError';
import { ManufacturerModel } from '../models/manufacturers/manufacturer.model';
import { PuzzleColorModel } from '../models/puzzle-colors/puzzle-color.model';
import { PagedRequest } from '../infrastructure/pagination/paged-request';
import { PagedResponse } from '../infrastructure/pagination/paged-response';
import { PuzzleModel } from '../models/puzzles/puzzle.model';
import { MaterialTypeModel } from '../models/material-types/material-type.model';
import { DifficultyLevelModel } from '../models/difficulty-levels/difficulty-level.model';
import { PuzzleTableRowModel } from '../models/puzzles/puzzle-table-row.model';
import { QueryParameters } from '../infrastructure/query-params/query-parameters';
import { RoleModel } from '../models/roles/role.model';
import { OrderStatusModel } from '../models/order-status/order-status.model';


@Injectable({
    providedIn: 'root'
})
export class PuzzleLookupService{

    private baseUrl: string = environment.apiUrl;
    private headers = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

    constructor(private httpClient: HttpClient){}

    getPuzzleTypes(queryParams?: QueryParameters): Observable<PuzzleTypeModel[]>{
        return this.httpClient.get<PuzzleTypeModel[]>(`${this.baseUrl}puzzleTypes`, this.headers);
    }

    getManufacturers() : Observable<ManufacturerModel[]>{
        return this.httpClient.get<ManufacturerModel[]>(`${this.baseUrl}manufacturers`, this.headers);
    }

    getPuzzleColors() : Observable<PuzzleColorModel[]> {
        return this.httpClient.get<PuzzleColorModel[]>(`${this.baseUrl}colors`, this.headers);
    }

    getPuzzles(pagedRequest: PagedRequest): Observable<PagedResponse<PuzzleTableRowModel>>{
        return this.httpClient.post<PagedResponse<PuzzleTableRowModel>>(`${this.baseUrl}puzzles/getPuzzles`, pagedRequest, this.headers);
    }

    getPuzzle(puzzleId: number): Observable<PuzzleTableRowModel>{
        return this.httpClient.get<PuzzleTableRowModel>(`${this.baseUrl}puzzles/getPuzzleFriendly/${puzzleId}`, this.headers);
    }

    getMaterialTypes(): Observable<MaterialTypeModel[]>{
        return this.httpClient.get<MaterialTypeModel[]>(`${this.baseUrl}materialType`, this.headers);
    }

    getDifficultyLevels(): Observable<DifficultyLevelModel[]>{
        return this.httpClient.get<DifficultyLevelModel[]>(`${this.baseUrl}lookup/difficultylevels`, this.headers);
    }

    getUserRoles(): Observable<RoleModel[]>{
        return this.httpClient.get<RoleModel[]>(`${this.baseUrl}lookup/roles`, this.headers);
    }

    getOrderStatusList(): Observable<OrderStatusModel[]>{
        return this.httpClient.get<OrderStatusModel[]>(`${this.baseUrl}lookup/orderstatuslist`, this.headers);
    }
}
