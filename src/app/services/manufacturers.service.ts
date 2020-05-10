import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ManufacturerModel } from 'src/app/models/manufacturers/manufacturer.model';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { handleError } from 'src/app/common/handleError';
import { ManufacturerForManipulationModel } from '../models/manufacturers/manufacturer-for-manipulation.model';
import { CreateEditManufacturerComponent } from '../admin_module/components/manufacturers/create-edit/create-edit-manufacturer.component';

@Injectable({
    providedIn: 'root'
})
export class ManufacturersService{

    private baseUrl: string = environment.apiUrl + 'manufacturers';

    constructor(private httpClient: HttpClient){}

    getAll() : Observable<ManufacturerModel[]>{
        return this.httpClient.get<ManufacturerModel[]>(this.baseUrl)
    }

    getbyId(id: number): Observable<ManufacturerModel>{
        return this.httpClient.get<ManufacturerModel>(`${this.baseUrl}/${id}`)
    }

    addNew(model: ManufacturerForManipulationModel){
        return this.httpClient.post(this.baseUrl, model)
    }

    update(id: number, model: ManufacturerForManipulationModel){
        return this.httpClient.put(`${this.baseUrl}/${id}`, model)
    }

    delete(id: number){
        return this.httpClient.delete(`${this.baseUrl}/${id}`)
    }
}