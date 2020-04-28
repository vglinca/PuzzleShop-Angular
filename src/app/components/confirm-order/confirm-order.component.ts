import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
    templateUrl: './confirm-order.component.html',
    styleUrls: ['./confirm-order.component.scss']
})
export class ConfirmOrderComponent implements OnInit{

    emailForm: FormGroup;
    customerForm: FormGroup;
    constructor(private orderService: OrderService,
                private formBuilder: FormBuilder){

    }

    ngOnInit(): void {
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
        })
    }
}

