import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { PuzzleTypeModel } from '../models/puzzle-types/PuzzleTypeModel';
import { catchError } from 'rxjs/operators';
import { handleError } from '../common/handleError';
import { ManufacturerModel } from '../models/manufacturers/ManufacturerModel';
import { PuzzleColorModel } from '../models/puzzle-colors/PuzzleColorModel';
import { PagedRequest } from '../infrastructure/paged-request';
import { PagedResponse } from '../infrastructure/paged-response';
import { PuzzleModel } from '../models/puzzles/PuzzleModel';
import { MaterialTypeModel } from '../models/material-types/material-type.model';
import { DifficultyLevelModel } from '../models/difficulty-levels/difficulty-level.model';


@Injectable()
export class PuzzleLookupService{

    private baseUrl: string = environment.apiUrl;
    private headers = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

    constructor(private httpClient: HttpClient){}

    getPuzzleTypes(): Observable<PuzzleTypeModel[]>{
        return this.httpClient.get<PuzzleTypeModel[]>(`${this.baseUrl}puzzleTypes`, this.headers)
            .pipe(catchError(handleError<PuzzleTypeModel[]>('getPuzzleTypes', [])));
    }

    getManufacturers() : Observable<ManufacturerModel[]>{
        return this.httpClient.get<ManufacturerModel[]>(`${this.baseUrl}manufacturers`, this.headers)
            .pipe(catchError(handleError<ManufacturerModel[]>('getManufacturers', [])));
    }

    getPuzzleColors() : Observable<PuzzleColorModel[]> {
        return this.httpClient.get<PuzzleColorModel[]>(`${this.baseUrl}colors`, this.headers)
        .pipe(catchError(handleError<PuzzleColorModel[]>('getColors', [])));
    }

    getPuzzles(pagedRequest: PagedRequest): Observable<PagedResponse<PuzzleModel>>{
        return this.httpClient.post<PagedResponse<PuzzleModel>>(`${this.baseUrl}puzzles/getPuzzles`, pagedRequest, this.headers)
            .pipe(catchError(handleError<PagedResponse<PuzzleModel>>('getPuzzles')));
    }

    getMaterialTypes(): Observable<MaterialTypeModel[]>{
        return this.httpClient.get<MaterialTypeModel[]>(`${this.baseUrl}materialType`, this.headers)
            .pipe(catchError(handleError<MaterialTypeModel[]>('getMaterialType')));
    }

    getDifficultyLevels(): Observable<DifficultyLevelModel[]>{
        return this.httpClient.get<DifficultyLevelModel[]>(`${this.baseUrl}lookup/difficultylevels`, this.headers)
            .pipe(catchError(handleError<DifficultyLevelModel[]>('getMaterialType')));
    }
}
