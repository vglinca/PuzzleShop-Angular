import { OrderItemModel } from '../order-items/order-item.model';
import { OrderStatusId } from '../order-status/order-status-id';

export interface OrderTableRowModel{
    id: number;
    userId: number;
    orderDate: string;
    totalItems: number;
    totalCost: number;
    orderStatus: string;
}