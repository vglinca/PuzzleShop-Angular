import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ManufacturerModel } from 'src/app/models/manufacturers/ManufacturerModel';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { handleError } from 'src/app/common/handleError';
import { ManufacturerForManipulationModel } from '../models/manufacturers/manufacturer-for-manipulation.model';
import { CreateEditManufacturerComponent } from '../components/manufacturers/create-edit-manufacturer.component';

@Injectable()
export class ManufacturersService{

    private baseUrl: string = environment.apiUrl + 'manufacturers';
    private headers = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

    constructor(private httpClient: HttpClient){}

    getAll() : Observable<ManufacturerModel[]>{
        return this.httpClient.get<ManufacturerModel[]>(this.baseUrl, this.headers)
    }

    getbyId(id: number): Observable<ManufacturerModel>{
        return this.httpClient.get<ManufacturerModel>(`${this.baseUrl}/${id}`, this.headers)
    }

    addNew(model: ManufacturerForManipulationModel){
        return this.httpClient.post(this.baseUrl, model, this.headers)
    }

    update(id: number, model: ManufacturerForManipulationModel){
        return this.httpClient.put(`${this.baseUrl}/${id}`, model, this.headers)
    }

    delete(id: number){
        return this.httpClient.delete(`${this.baseUrl}/${id}`, this.headers)
    }
}