import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { PuzzleColorModel } from 'src/app/models/puzzle-colors/puzzle-color.model';
import { Observable } from 'rxjs';
import { PuzzleColorForCreationModel } from '../models/puzzle-colors/puzzle-color-for-creation.model';

@Injectable({
    providedIn: 'root'
})
export class PuzzleColorsService{

    private baseUrl: string = environment.apiUrl + 'colors';

    constructor(private httpClient: HttpClient){}

    public getAll(): Observable<PuzzleColorModel[]>{
        return this.httpClient.get<PuzzleColorModel[]>(this.baseUrl)
    }

    public getById(colorId: number): Observable<PuzzleColorModel>{
        return this.httpClient.get<PuzzleColorModel>(`${this.baseUrl}/${colorId}`)
    }

    public add(model: PuzzleColorForCreationModel): Observable<PuzzleColorModel>{
        return this.httpClient.post<PuzzleColorModel>(this.baseUrl, model)
    }

    public update(colorId: number, model: PuzzleColorForCreationModel){
        return this.httpClient.put(`${this.baseUrl}/${colorId}`, model)
    }

    public delete(colorId: number){
        return this.httpClient.delete(`${this.baseUrl}/${colorId}`)
    }
}