import { OrderItemModel } from '../order-items/order-item.model';

export interface OrderModel{
    id: number;
    userId: number;
    orderDate: string;
    contactEmail: string;
    customerFirstName: string;
    customerLastName: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    phone: string;
    totalItems: number;
    totalCost: number;
    orderStatus: string;
    orderStatusId: number;
    orderItems: OrderItemModel[];
}