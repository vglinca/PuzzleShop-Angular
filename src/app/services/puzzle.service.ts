import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedRequest } from 'src/app/infrastructure/pagination/paged-request';
import { PagedResponse } from 'src/app/infrastructure/pagination/paged-response';
import { PuzzleModel } from 'src/app/models/puzzles/puzzle.model';
import { PuzzleForUpdateModel } from '../models/puzzles/puzzle-for-update.model';
import { PuzzleTableRowModel } from 'src/app/models/puzzles/puzzle-table-row.model';

@Injectable({
    providedIn: 'root'
})
export class PuzzleService{

    private baseUrl: string = environment.apiUrl + 'puzzles';

    constructor(private httpClient: HttpClient){}

    public getAllPuzzles(pagedRequest: PagedRequest): Observable<PagedResponse<PuzzleTableRowModel>>{
        return this.httpClient.post<PagedResponse<PuzzleTableRowModel>>(`${this.baseUrl}/pagedPuzzles`, pagedRequest);
    }

    public getPuzzle(puzzleId: number): Observable<PuzzleModel>{
        return this.httpClient.get<PuzzleModel>(`${this.baseUrl}/${puzzleId}`);
    }

    public getPuzzleFriendly(puzzleId: number): Observable<PuzzleTableRowModel>{
        return this.httpClient.get<PuzzleTableRowModel>(`${this.baseUrl}/puzzleFriendly/${puzzleId}`);
    }

    public addPuzzle(model: FormData) : Observable<PuzzleModel>{
        return this.httpClient.post<PuzzleModel>(this.baseUrl, model);
    }  

    public updatePuzzle(puzzleId: number, model: PuzzleForUpdateModel){
        return this.httpClient.put(`${this.baseUrl}/${puzzleId}`, model);
    }

    public deletePuzzle(puzzleId: number){
        return this.httpClient.delete(`${this.baseUrl}/${puzzleId}`);
    }
}