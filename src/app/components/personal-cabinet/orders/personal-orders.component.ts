import { Component, OnInit } from '@angular/core';
import { LoggedInUserInfo } from 'src/app/models/users/logged-in-user-info';
import { AccountService } from 'src/app/services/account.service';
import { NotificationService } from 'src/app/services/notification.service';
import { OrderService } from 'src/app/services/order.service';
import { ActivatedRoute } from '@angular/router';
import { OrderModel } from 'src/app/models/orders/order.model';
import { heightAnimation } from 'src/app/common/animations/height-animation';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'personal-orders',
    templateUrl: './personal-orders.component.html',
    styleUrls: ['./personal-orders.component.scss'],
    animations: [heightAnimation]
})

export class PersonalOrdersComponent implements OnInit {
    
    staticFilesUrl: string = environment.staticFilesUrl;
    currentUser: LoggedInUserInfo;
    orders: OrderModel[] = [];

    animationStates: string[] = [];
    dataLoaded: boolean = false;
    initialState: string = 'initial';
    
    constructor(private accountService: AccountService,
                private notificationService: NotificationService,
                private orderService: OrderService,
                private activayedRoute: ActivatedRoute) { 
                    this.currentUser = this.accountService.parseToken();
                }

    ngOnInit(): void {
        this.loadOrdersFromApi();
    }

    changeAnimatioState(index: number): void{
        this.animationStates[index] = this.animationStates[index] === 'initial' ? 'final' : 'initial';
    } 
        

    private loadOrdersFromApi(): void{
        this.orderService.getAllOrders(this.currentUser.userId)
            .subscribe((o : OrderModel[]) => {
                this.orders = o;
                for(let i = 0; i < o.length; i++){
                    this.animationStates.push('initial');
                }
                this.dataLoaded = true;
            });
    }
}