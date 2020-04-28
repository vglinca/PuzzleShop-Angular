import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerDetailsModel } from 'src/app/models/customers/customer-details.model';
import { AccountService } from 'src/app/services/account.service';


@Component({
    templateUrl: './confirm-order.component.html',
    styleUrls: ['./confirm-order.component.scss']
})
export class ConfirmOrderComponent implements OnInit{

    emailForm: FormGroup;
    customerForm: FormGroup;

    items: Array<number> = new Array<number>();

    constructor(private orderService: OrderService,
                private formBuilder: FormBuilder,
                private accountService: AccountService){

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
    }

    onSubmit(): void{
        let userId: number = this.accountService.parseToken().userId;
        let customer: CustomerDetailsModel = {...this.customerForm.value};
        customer.contactEmail = this.emailForm.controls['email'].value;
        console.log(customer);
        this.orderService.confirmOrder(userId, customer)
            .subscribe(() => {

            }, err => console.log(err));
    }
}

