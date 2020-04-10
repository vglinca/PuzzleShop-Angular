import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class PuzzleService{

    private baseUrl = environment.apiUrl;

    constructor(private httpClient: HttpClient){}

    
}