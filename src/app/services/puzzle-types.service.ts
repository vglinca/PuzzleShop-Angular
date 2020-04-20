import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PuzzleTypeModel } from 'src/app/models/puzzle-types/puzzle-type.model';
import { handleError } from 'src/app/common/handleError';
import { catchError } from 'rxjs/operators';
import { PuzzleTypeForCreationModel } from '../models/puzzle-types/puzzle-type-for-creation.model';
import { PuzzleTypeTableRowModel } from 'src/app/models/puzzle-types/puzzle-type-table-row.model';

@Injectable({
    providedIn: 'root'
})
export class PuzzleTypesService{
    private baseUrl: string = environment.apiUrl + 'puzzleTypes';
    private headers = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

    constructor(private httpClient: HttpClient){}

    public getAll(): Observable<PuzzleTypeTableRowModel[]>{
        return this.httpClient.get<PuzzleTypeTableRowModel[]>(this.baseUrl, this.headers)
    }

    public getById(puzzleTypeId: number): Observable<PuzzleTypeModel>{
        return this.httpClient.get<PuzzleTypeModel>(`${this.baseUrl}/${puzzleTypeId}`, this.headers)
    }

    public add(model: PuzzleTypeForCreationModel): Observable<PuzzleTypeModel>{
        return this.httpClient.post<PuzzleTypeModel>(this.baseUrl, model, this.headers)
    }

    public update(puzzleTypeId: number, model: PuzzleTypeForCreationModel){
        return this.httpClient.put(`${this.baseUrl}/${puzzleTypeId}`, model, this.headers)
    }

    public delete(puzzleTypeId: number){
        return this.httpClient.delete(`${this.baseUrl}/${puzzleTypeId}`, this.headers)
    }
}