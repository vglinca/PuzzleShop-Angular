import { OrderItemModel } from '../order-items/order-item.model';

export interface OrderModel{
    id: number;
    userId: number;
    orderDate: string;
    totalItems: number;
    totalCost: number;
    orderStatus: string;
    orderItems: OrderItemModel[];
}