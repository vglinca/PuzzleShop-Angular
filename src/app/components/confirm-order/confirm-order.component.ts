import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerDetailsModel } from 'src/app/models/customers/customer-details.model';
import { AccountService } from 'src/app/services/account.service';
import { OrderModel } from 'src/app/models/orders/order.model';
import { PuzzleTableRowModel } from 'src/app/models/puzzles/puzzle-table-row.model';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';


@Component({
    templateUrl: './confirm-order.component.html',
    styleUrls: ['./confirm-order.component.scss']
})
export class ConfirmOrderComponent implements OnInit{

    emailForm: FormGroup;
    customerForm: FormGroup;
    userId: number;
    staticFileUrl: string = environment.staticFilesUrl;

    pendingOrder: OrderModel;

    items: Array<number> = new Array<number>();

    constructor(private orderService: OrderService,
                private formBuilder: FormBuilder,
                private router: Router,
                private accountService: AccountService){
                    this.userId = this.accountService.parseToken().userId;
    }

    ngOnInit(): void {
        for(let i = 0; i < 5; i++){
            this.items.push(i);
        }

        this.customerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            address: ['', Validators.required],
            city: ['', Validators.required],
            country: ['', Validators.required],
            postalCode: ['', Validators.required],
            phone: ['', Validators.required]
        });
        this.emailForm = this.formBuilder.group({
            email: ['', Validators.required]
        });

        this.loadOrderFromApi();
    }

    private loadOrderFromApi(): void{
        this.orderService.getCart(this.userId)
            .subscribe((o: OrderModel) => {
                this.pendingOrder = o;
            }, err => console.log(err));
    }

    onSubmit(): void{
        let customer: CustomerDetailsModel = {...this.customerForm.value};
        customer.contactEmail = this.emailForm.controls['email'].value;
        console.log(customer);
        this.orderService.confirmOrder(this.userId, customer)
            .subscribe(() => {
                
            }, err => console.log(err));
    }

    onReturnClick():void{
        this.router.navigate(['/cart']);
    }
}

