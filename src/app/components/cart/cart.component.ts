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

  constructor(private orderService: OrderService,
              private accountService: AccountService,
              private puzzleService: PuzzleService) {
      this.userId = this.accountService.parseToken().userId;
     }

  ngOnInit(): void {
    this.getCart();
  }

  incrementQuantity(item: OrderItemModel): void{
    if(item.quantity < item.puzzle.availableInStock){
      item.quantity++;
      item.cost += item.puzzle.price;
      this.total += item.puzzle.price;
    }
  }

  decrementQuantity(item: OrderItemModel): void{
    if(item.quantity > 0){
      item.quantity--;
      item.cost -= item.puzzle.price;
      this.total -= item.puzzle.price;
    }
  }

  onRefresh(item: OrderItemModel): void{
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
      }, err => console.log(err));
  }

  onDeleteItem(item: OrderItemModel): void{
    this.orderService.removeOrderItem(this.userId, item.id)
      .subscribe(() => {
        this.total = 0;
        this.orderItems = [];
        this.ngOnInit();
      }, err => console.log(err));
  }

  private getCart() {
    this.orderService.getCart(this.userId)
      .subscribe((order: OrderModel) => {
        console.log('ORDER ', order);
        this.order = order;
        if(order){
          this.orderItems = order.orderItems;
          this.orderItems.forEach(item => {
            this.total += item.cost;
          });
        }
      });
  }
}