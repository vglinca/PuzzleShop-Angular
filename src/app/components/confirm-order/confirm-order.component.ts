import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerDetailsModel } from 'src/app/models/customers/customer-details.model';
import { AccountService } from 'src/app/services/account.service';
import { OrderModel } from 'src/app/models/orders/order.model';
import { PuzzleTableRowModel } from 'src/app/models/puzzles/puzzle-table-row.model';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { CountryService } from 'src/app/services/country.service';
import { CountryModel } from 'src/app/infrastructure/countries/country.model';
import { forkJoin } from 'rxjs';


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

    countries: CountryModel[] = [];

    constructor(private orderService: OrderService,
                private formBuilder: FormBuilder,
                private router: Router,
                private countryService: CountryService,
                private accountService: AccountService){
                    this.userId = this.accountService.parseToken().userId;
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
        });

        this.loadOrderFromApi();
    }

    private loadOrderFromApi(): void{
        const cart = this.orderService.getCart(this.userId);
        const countries = this.countryService.getAll();

        forkJoin(cart, countries)
            .subscribe(([ca, co]) =>{
                this.pendingOrder = ca;
                this.countries = co;
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

