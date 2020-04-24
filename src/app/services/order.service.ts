import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderModel } from '../models/orders/order.model';
import { threadId } from 'worker_threads';
import { OrderItemForCreateModel } from '../models/order-items/order-item-for-create.model';

@Injectable({
    providedIn: 'root'
})
export class OrderService{

    private baseUrl: string = environment.apiUrl + 'orders';
    private headers = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

    constructor(private http: HttpClient){}

    public getCart(userId: number): Observable<OrderModel>{
        return this.http.get<OrderModel>(`${this.baseUrl}/getCart/${userId}`, this.headers);
    }

    public getAllOrders(userId: number): Observable<OrderModel[]>{
        return this.http.get<OrderModel[]>(`${this.baseUrl}/orders/${userId}`, this.headers);
    }

    public editCart(orderItem: OrderItemForCreateModel){
        return this.http.post(`${this.baseUrl}/addToCart`, orderItem, this.headers);
    }
}