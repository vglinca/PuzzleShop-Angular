import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { OrderModel } from 'src/app/models/orders/order.model';
import { ManageOrderService } from 'src/app/services/manage-order.service';

@Component({
    templateUrl: './order-details.component.html',
    styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit{

    orderId: number = 0;
    order: OrderModel;

    tableColumns: string[] = ['id', 'cost', 'quantity', 'puzzleName', 'itemPrice'];

    constructor(private activatedRoute: ActivatedRoute,
                private manageOrderService: ManageOrderService){}

    ngOnInit(): void {
        this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
            this.orderId = +params.get('id');
            this.loadOrderFromapi();
        });
    }

    private loadOrderFromapi(): void{
        this.manageOrderService.getOrder(this.orderId)
            .subscribe((o: OrderModel) => {
                this.order = o;
                console.log(this.order);
            });
    }
}