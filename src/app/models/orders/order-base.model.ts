export abstract class OrderBaseModel{
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
    orderStatusTitle: string;
    orderStatusId: number;
}