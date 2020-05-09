import { OrderItemModel } from '../order-items/order-item.model';
import { OrderBaseModel } from './order-base.model';

export class OrderModel extends OrderBaseModel{
    orderItems: OrderItemModel[];
}