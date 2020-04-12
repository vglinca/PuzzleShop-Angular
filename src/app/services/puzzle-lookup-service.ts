import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { PuzzleTypeModel } from '../models/puzzle-types/PuzzleTypeModel';
import { catchError } from 'rxjs/operators';
import { handleError } from '../common/handleError';
import { ManufacturerModel } from '../models/manufacturers/ManufacturerModel';
import { PuzzleColorModel } from '../models/puzzle-colors/PuzzleColorModel';
import { PagedRequest } from '../models/1pagination/paged-request';
import { PagedResponse } from '../models/1pagination/paged-response';
import { PuzzleModel } from '../models/puzzles/PuzzleModel';


@Injectable()
export class PuzzleLookupService{

    private baseUrl: string = environment.apiUrl;

    constructor(private httpClient: HttpClient){}

    getPuzzleTypes(): Observable<PuzzleTypeModel[]>{
        var headers = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
        return this.httpClient.get<PuzzleTypeModel[]>(`${this.baseUrl}puzzleTypes`, headers)
            .pipe(catchError(handleError<PuzzleTypeModel[]>('getPuzzleTypes', [])));
    }

    getManufacturers() : Observable<ManufacturerModel[]>{
        var headers = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
        return this.httpClient.get<ManufacturerModel[]>(`${this.baseUrl}manufacturers`, headers)
            .pipe(catchError(handleError<ManufacturerModel[]>('getManufacturers', [])));
    }

    getPuzzleColors() : Observable<PuzzleColorModel[]> {
        var headers = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
        return this.httpClient.get<PuzzleColorModel[]>(`${this.baseUrl}colors`, headers)
        .pipe(catchError(handleError<PuzzleColorModel[]>('getColors', [])));
    }

    getPuzzles(pagedRequest: PagedRequest): Observable<PagedResponse<PuzzleModel>>{
        var headers = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
        return this.httpClient.post<PagedResponse<PuzzleModel>>(`${this.baseUrl}puzzles/getPuzzles`, pagedRequest, headers)
            .pipe(catchError(handleError<PagedResponse<PuzzleModel>>('getPuzzles')));
    }
}
