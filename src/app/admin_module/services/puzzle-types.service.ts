import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PuzzleTypeModel } from 'src/app/models/puzzle-types/PuzzleTypeModel';
import { handleError } from 'src/app/common/handleError';
import { catchError } from 'rxjs/operators';
import { PuzzleTypeForCreationModel } from '../models/puzzle_types/puzzle-type-for-creation.model';

@Injectable()
export class PuzzleTypesService{
    private baseUrl: string = environment.apiUrl + 'puzzleTypes';
    private headers = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

    constructor(private httpClient: HttpClient){}

    public getAll(): Observable<PuzzleTypeModel[]>{
        return this.httpClient.get<PuzzleTypeModel[]>(this.baseUrl, this.headers)
            .pipe(catchError(handleError<PuzzleTypeModel[]>('getPuzzleTypes', [])));
    }

    public getById(puzzleTypeId: number): Observable<PuzzleTypeModel>{
        return this.httpClient.get<PuzzleTypeModel>(`${this.baseUrl}/${puzzleTypeId}`, this.headers)
            .pipe(catchError(handleError<PuzzleTypeModel>('getPuzzleType')));
    }

    public add(model: PuzzleTypeForCreationModel): Observable<PuzzleTypeModel>{
        return this.httpClient.post<PuzzleTypeModel>(this.baseUrl, model, this.headers)
        .pipe(catchError(handleError<PuzzleTypeModel>('addPuzzleType')));
    }

    public update(puzzleTypeId: number, model: PuzzleTypeForCreationModel){
        return this.httpClient.put(`${this.baseUrl}/${puzzleTypeId}`, model, this.headers)
        .pipe(catchError(handleError<PuzzleTypeForCreationModel>('updatePuzzleType')));
    }

    public delete(puzzleTypeId: number){
        return this.httpClient.delete(`${this.baseUrl}/${puzzleTypeId}`, this.headers)
        .pipe(catchError(handleError<PuzzleTypeModel>('deletePuzzleType')));
    }
}