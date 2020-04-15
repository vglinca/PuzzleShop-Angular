import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { PuzzleColorModel } from 'src/app/models/puzzle-colors/PuzzleColorModel';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { handleError } from 'src/app/common/handleError';
import { PuzzleColorForCreationModel } from '../models/puzzle_colors/puzzle-color-for-creation.model';

@Injectable()
export class PuzzleColorsService{

    private baseUrl: string = environment.apiUrl + 'colors';
    private headers = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

    constructor(private httpClient: HttpClient){}

    public getAll(): Observable<PuzzleColorModel[]>{
        return this.httpClient.get<PuzzleColorModel[]>(this.baseUrl, this.headers)
            .pipe(catchError(handleError<PuzzleColorModel[]>('getPuzzleColors', [])));
    }

    public getById(colorId: number): Observable<PuzzleColorModel>{
        return this.httpClient.get<PuzzleColorModel>(`${this.baseUrl}/${colorId}`, this.headers)
            .pipe(catchError(handleError<PuzzleColorModel>('getPuzzleColor')));
    }

    public add(model: PuzzleColorForCreationModel): Observable<PuzzleColorModel>{
        return this.httpClient.post<PuzzleColorModel>(this.baseUrl, model, this.headers)
        .pipe(catchError(handleError<PuzzleColorModel>('addPuzzleColor')));
    }

    public update(colorId: number, model: PuzzleColorForCreationModel){
        return this.httpClient.put(`${this.baseUrl}/${colorId}`, model, this.headers)
        .pipe(catchError(handleError<PuzzleColorForCreationModel>('updatePuzzleColor')));
    }

    public delete(colorId: number){
        return this.httpClient.delete(`${this.baseUrl}/${colorId}`, this.headers)
        .pipe(catchError(handleError<PuzzleColorModel>('deletePuzzleColor')));
    }
}