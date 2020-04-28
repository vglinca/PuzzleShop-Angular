import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderModel } from '../models/orders/order.model';
import { OrderItemForCreateModel } from '../models/order-items/order-item-for-create.model';
import { logging } from 'protractor';
import { CustomerDetailsModel } from '../models/customers/customer-details.model';

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

    public removeOrderItem(userId: number, itemId: number){
        return this.http.delete(`${this.baseUrl}/removeOrderItem/${userId}/${itemId}`, this.headers);
    }

    public confirmOrder(userId: number, customerDetails: CustomerDetailsModel){
        return this.http.put(`${this.baseUrl}/confirmOrder/${userId}`, customerDetails, this.headers);
    }
}