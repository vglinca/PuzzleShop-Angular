import { OrderItemModel } from '../order-items/order-item.model';
import { OrderStatusId } from '../order-status/order-status-id';

export interface OrderTableRowModel {
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
}