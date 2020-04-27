import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { OrderModel } from 'src/app/models/orders/order.model';
import { ManageOrderService } from 'src/app/services/manage-order.service';
import { UsersService } from 'src/app/services/users.service';
import { mergeMap } from 'rxjs/operators';
import { UserWithRolesModel } from 'src/app/models/users/user-with-roles.model';
import { PuzzleLookupService } from 'src/app/services/puzzle-lookup-service';
import { OrderStatusModel } from 'src/app/models/order-status/order-status.model';
import { forkJoin } from 'rxjs';
import { FormControl } from '@angular/forms';
import { OrderStatusForSettingModel } from 'src/app/models/order-status/order-status-for-setting.model';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
    templateUrl: './order-details.component.html',
    styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit, AfterViewInit{

    orderId: number = 0;
    order: OrderModel;
    customer: UserWithRolesModel;
    orderStatusList: OrderStatusModel[] = [];
    orderStatus: OrderStatusModel;
    changeOrderStatus: number;

    tableColumns: string[] = ['id', 'cost', 'quantity', 'puzzleName', 'itemPrice'];

    constructor(private activatedRoute: ActivatedRoute,
                private manageOrderService: ManageOrderService,
                private userService: UsersService,
                private lookupService: PuzzleLookupService,
                private notificationService: NotificationService){}
    

    ngOnInit(): void {
        this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
            this.orderId = +params.get('id');
            this.loadOrderFromapi();
        });
    }

    ngAfterViewInit(): void {
        this.orderStatus = this.orderStatusList.filter(s => s.name === this.order.orderStatus)[0];
    }

    private loadOrderFromapi(): void{ 
        const customer = this.manageOrderService.getOrder(this.orderId)
            .pipe(mergeMap((order: OrderModel) => {
                this.order = order;
                return this.userService.getUser(order.userId);
            }));

        const orderStatusList = this.lookupService.getOrderStatusList();

        forkJoin(customer, orderStatusList)
            .subscribe(([c, os]) => {
                this.customer = c;
                this.orderStatusList = os.filter(s => s.orderStatusId > 2 && s.name !== this.order.orderStatus);
                console.log(this.orderStatusList);
            });
    }

    updateOrdrStatus(): void{
        console.log(this.changeOrderStatus);
        let model: OrderStatusForSettingModel = {statusId: this.changeOrderStatus};
        this.manageOrderService.changeOrderStatus(this.orderId, model)
            .subscribe(() => {
                this.notificationService.success('Order Status chaged.');
                this.loadOrderFromapi();
            });
    }
}