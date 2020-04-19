import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ImageModel } from 'src/app/models/images/image.model';
import { Observable } from 'rxjs';

@Injectable()
export class ImagesService{
    private baseUrl: string = environment.apiUrl;
    private headers = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

    constructor(private httpClient: HttpClient){}

    public getImagesByPuzzle(puzzleId: number): Observable<ImageModel[]>{
        return this.httpClient.get<ImageModel[]>(`${this.baseUrl}puzzles/${puzzleId}/images`, this.headers);
    }

    public addImages(puzzleId: number, model: FormData){
        return this.httpClient.post(`${this.baseUrl}puzzles/${puzzleId}/images/addImages`, model);
    }

    public deleteImages(puzzleId: number, ids: Array<number>){
        return this.httpClient.post(`${this.baseUrl}puzzles/${puzzleId}/images/deleteImages`, ids);
    }
}