import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { OrderModel } from 'src/app/models/orders/order.model';
import { ManageOrderService } from 'src/app/services/manage-order.service';
import { UsersService } from 'src/app/services/users.service';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { UserWithRolesModel } from 'src/app/models/users/user-with-roles.model';
import { PuzzleLookupService } from 'src/app/services/lookup.service';
import { OrderStatusModel } from 'src/app/models/order-status/order-status.model';
import { forkJoin, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { OrderStatusForSettingModel } from 'src/app/models/order-status/order-status-for-setting.model';
import { NotificationService } from 'src/app/services/notification.service';
import { OrderStatusId } from 'src/app/models/order-status/order-status-id';
import { NgOnDestroy } from 'src/app/services/ng-on-destroy.service';

@Component({
    templateUrl: './order-details.component.html',
    styleUrls: ['./order-details.component.scss'],
    providers: [NgOnDestroy]
})
export class OrderDetailsComponent implements OnInit, AfterViewInit
//, OnDestroy
{

    orderId: number = 0;
    order: OrderModel;
    customer: UserWithRolesModel;
    orderStatusList: OrderStatusModel[] = [];
    orderStatus: OrderStatusModel;
    changeOrderStatus: number;
    isNotAwaitingPayment: boolean = true;

    subscriptions: Subscription[] = [];
    activatedRouteSubscription: Subscription;

    tableColumns: string[] = ['id', 'cost', 'quantity', 'puzzleName', 'itemPrice'];

    constructor(private activatedRoute: ActivatedRoute,
                private manageOrderService: ManageOrderService,
                private userService: UsersService,
                private lookupService: PuzzleLookupService,
                private notificationService: NotificationService,
                private readonly onDestroy$: NgOnDestroy){}
    

    ngOnInit(): void {
        this.activatedRouteSubscription = this.activatedRoute.paramMap
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((params: ParamMap) => {
            this.orderId = +params.get('id');
            this.loadOrderFromapi();
        });
        this.subscriptions.push(this.activatedRouteSubscription);
    }

    ngAfterViewInit(): void {
        this.orderStatus = this.orderStatusList.filter(s => s.name === this.order.orderStatusTitle)[0];
    }

    private loadOrderFromapi(): void{ 
        const customer = this.manageOrderService.getOrder(this.orderId)
            .pipe(mergeMap((order: OrderModel) => {
                this.order = order;
                return this.userService.getUser(order.userId);
            }));
        const orderStatusList = this.lookupService.getOrderStatusList();
        forkJoin(customer, orderStatusList)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(([c, os]) => {
                this.customer = c;
                this.orderStatusList = os.filter(s => s.orderStatusId > 2 && 
                    s.name !== this.order.orderStatusTitle);
                this.isNotAwaitingPayment = this.order.orderStatusId !== OrderStatusId.AwaitingPayment;
            });
    }

    updateOrdrStatus(): void{
        let model: OrderStatusForSettingModel = {statusId: this.changeOrderStatus};
        this.manageOrderService.changeOrderStatus(this.orderId, model)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(() => {
                this.notificationService.success('Order Status chaged.');
                this.loadOrderFromapi();
            });
    }

    // ngOnDestroy(): void{
    //     this.subscriptions.forEach(s => {
    //         if(s){
    //             s.unsubscribe();
    //         }
    //     });
    // }
}