import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { CountryModel } from '../infrastructure/countries/country.model';

@Injectable({
    providedIn: 'root'
})
export class CountryService{

    private baseUrl: string = environment.countriesApiUrl;

    constructor(private http: HttpClient){}

    public getAll(): Observable<CountryModel[]>{
        return this.http.get<CountryModel[]>(`${this.baseUrl}all`);
    }

    public getByName(name: string): Observable<CountryModel>{
        return this.http.get<CountryModel>(`${this.baseUrl}alpha/${name}`);
    }
}