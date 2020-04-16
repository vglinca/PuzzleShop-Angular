import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedRequest } from 'src/app/models/1pagination/paged-request';
import { PagedResponse } from 'src/app/models/1pagination/paged-response';
import { PuzzleModel } from 'src/app/models/puzzles/PuzzleModel';
import { catchError } from 'rxjs/operators';
import { handleError } from 'src/app/common/handleError';
import { PuzzleForCreationModel } from '../models/puzzles/puzzle-for-creation.model';

@Injectable()
export class PuzzleService{

    private baseUrl: string = environment.apiUrl + 'puzzles';
    private headers = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

    constructor(private httpClient: HttpClient){}

    public getAllPuzzles(pagedRequest: PagedRequest): Observable<PagedResponse<PuzzleModel>>{
        return this.httpClient.post<PagedResponse<PuzzleModel>>(`${this.baseUrl}/getPuzzles`, pagedRequest, this.headers)
            .pipe(catchError(handleError<PagedResponse<PuzzleModel>>('getPuzzles')));
    }

    public getPuzzle(puzzleId: number): Observable<PuzzleModel>{
        return this.httpClient.get<PuzzleModel>(`${this.baseUrl}/${puzzleId}`, this.headers)
        .pipe(catchError(handleError<PuzzleModel>('getPuzzle')));
    }

    public addPuzzle(model: FormData) : Observable<PuzzleModel>{
        var head = {headers: new HttpHeaders({'Content-Type': 'multipart/form-data'})};
        return this.httpClient.post<PuzzleModel>(this.baseUrl, model);
        // .pipe(catchError(handleError<PuzzleModel>('addPuzzle')));
    }  

    public updatePuzzle(puzzleId: number, model: PuzzleForCreationModel){
        return this.httpClient.put(`${this.baseUrl}/${puzzleId}`, model, this.headers)
            .pipe(catchError(handleError<PuzzleForCreationModel>('updatePuzzle')));
    }

    public deletePuzzle(puzzleId: number){
        return this.httpClient.delete(`${this.baseUrl}/${puzzleId}`, this.headers)
            .pipe(catchError(handleError<PuzzleModel>('deletePuzzle')));
    }
}