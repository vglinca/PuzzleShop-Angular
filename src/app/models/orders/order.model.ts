import { OrderItemModel } from '../order-items/order-item.model';

export interface OrderModel{
    id: number;
    userId: number;
    orderDate: Date;
    totalItems: number;
    totalCost: number;
    orderStatus: string;
    orderItems: OrderItemModel[];
}