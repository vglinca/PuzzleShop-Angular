import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ReviewModel } from '../models/reviews/review.model';
import { ReviewForCreationModel } from '../models/reviews/review-for-creation.model';

@Injectable({providedIn: 'root'})
export class ReviewService {

    private baseUrl: string = environment.apiUrl;
    private headers = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

    constructor(private httpClient: HttpClient) { }

    public getReviews(puzzleId: number): Observable<ReviewModel[]>{
        return this.httpClient.get<ReviewModel[]>(`${this.baseUrl}${puzzleId}/reviews`, this.headers);
    }

    public addReview(puzzleId: number, review: ReviewForCreationModel){
        return this.httpClient.post(`${this.baseUrl}${puzzleId}/reviews`, review, this.headers);
    }
}