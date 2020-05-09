import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { OrderModel } from 'src/app/models/orders/order.model';
import { OrderItemModel } from 'src/app/models/order-items/order-item.model';
import { AccountService } from 'src/app/services/account.service';
import { mergeMap, switchMap, map } from 'rxjs/operators';
import { PuzzleService } from 'src/app/services/puzzle.service';
import { from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrderItemForCreateModel } from 'src/app/models/order-items/order-item-for-create.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { errorMessage } from 'src/app/common/consts/generic-error-message';

@Component({
	templateUrl: './cart.component.html',
	styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

	staticFilesUrl: string = environment.staticFilesUrl;
	order: OrderModel;
	orderItems: OrderItemModel[] = [];
	userId: number;
	total: number = 0;
	showSpinner: boolean = true;

	constructor(private orderService: OrderService,
		private accountService: AccountService,
		private router: Router,
		private notificationService: NotificationService,) {
		this.userId = this.accountService.parseToken().userId;
	}

	ngOnInit(): void {
		this.showSpinner = true;
		this.getCart();
	}

	incrementQuantity(item: OrderItemModel): void {
		if (item.quantity < item.puzzle.availableInStock) {
			item.quantity++;
			item.cost += item.puzzle.price;
			this.onRefresh(item);
		}
	}

	decrementQuantity(item: OrderItemModel): void {
		if (item.quantity > 1) {
			item.quantity--;
			item.cost -= item.puzzle.price;
			this.onRefresh(item);
		}
	}

	onRefresh(item: OrderItemModel): void {
		let orderItemForCreate: OrderItemForCreateModel = {
			cost: item.cost,
			quantity: item.quantity,
			puzzleId: item.puzzle.id,
			userId: this.userId
		};
		this.orderService.editCart(orderItemForCreate)
			.subscribe(() => {
				this.total = 0;
				this.ngOnInit();
			}, err => this.notificationService.warn(errorMessage));
	}

	onDeleteItem(item: OrderItemModel): void {
		this.orderService.removeOrderItem(this.userId, item.id)
			.subscribe(() => {
				this.total = 0;
				this.orderItems = [];
				this.ngOnInit();
			}, err => this.notificationService.warn(errorMessage));
	}

	private getCart() {
		this.orderService.getCart(this.userId)
			.subscribe((order: OrderModel) => {
				this.showSpinner = false;
				this.order = order;
				if (order) {
					this.orderItems = order.orderItems;
					this.orderItems.forEach(item => {
						this.total += item.cost;
					});
				}
			});
	}

	checkout = () => this.router.navigate(['/checkout']);
	openHomePage = () => this.router.navigate(['/home']);
}