import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderModel } from '../models/orders/order.model';
import { OrderItemForCreateModel } from '../models/order-items/order-item-for-create.model';
import { CustomerDetailsModel } from '../models/customers/customer-details.model';

@Injectable({
    providedIn: 'root'
})
export class OrderService{

    private baseUrl: string = environment.apiUrl + 'orders';

    constructor(private http: HttpClient){}

    public getCart(userId: number): Observable<OrderModel>{
        return this.http.get<OrderModel>(`${this.baseUrl}/getCart/${userId}`);
    }

    public getAllOrders(userId: number): Observable<OrderModel[]>{
        return this.http.get<OrderModel[]>(`${this.baseUrl}/orders/${userId}`);
    }

    public editCart(orderItem: OrderItemForCreateModel){
        return this.http.post(`${this.baseUrl}/addToCart`, orderItem);
    }

    public removeOrderItem(userId: number, itemId: number){
        return this.http.delete(`${this.baseUrl}/orderItem/${userId}/${itemId}`);
    }

    public confirmOrder(userId: number, customerDetails: CustomerDetailsModel){
        return this.http.put(`${this.baseUrl}/confirmOrder/${userId}`, customerDetails);
    }

    public placeOrder(userId: number, orderId: number, customerDetails: CustomerDetailsModel){
        return this.http.put(`${this.baseUrl}/placeOrder/${userId}/${orderId}`, customerDetails);
    }
}