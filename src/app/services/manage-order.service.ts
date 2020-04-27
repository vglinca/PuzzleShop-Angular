import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { PagedRequest } from '../infrastructure/pagination/paged-request';
import { OrderModel } from '../models/orders/order.model';
import { Observable } from 'rxjs';
import { PagedResponse } from '../infrastructure/pagination/paged-response';

@Injectable({
    providedIn: 'root'
})
export class ManageOrderService{

    private baseUrl: string = environment.apiUrl + 'manageOrders';
    private headers = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

    constructor(private http: HttpClient){
    }

    public getOrdersPaged(pagedRequest: PagedRequest): Observable<PagedResponse<OrderModel>>{
        return this.http.post<PagedResponse<OrderModel>>(`${this.baseUrl}/getOrdersPaged`, pagedRequest, this.headers);
    }

    public getOrder(orderId: number): Observable<OrderModel>{
        return this.http.get<OrderModel>(`${this.baseUrl}/${orderId}`, this.headers);
    }
}