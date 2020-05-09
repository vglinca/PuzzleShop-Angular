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
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { StripePaymentComponent } from '../stripe-payment/stripe-payment.component';
import { LoggedInUserInfo } from 'src/app/models/users/logged-in-user-info';
import { NotificationService } from 'src/app/services/notification.service';
import { errorMessage } from 'src/app/common/consts/generic-error-message';


@Component({
    templateUrl: './confirm-order.component.html',
    styleUrls: ['./confirm-order.component.scss']
})
export class ConfirmOrderComponent implements OnInit{
    
    handler: any;

    showSpinner: boolean = false;

    emailForm: FormGroup;
    customerForm: FormGroup;
    userId: number;
    currentUser: LoggedInUserInfo;
    staticFileUrl: string = environment.staticFilesUrl;

    pendingOrder: OrderModel;

    countries: CountryModel[] = [];

    constructor(private orderService: OrderService,
                private formBuilder: FormBuilder,
                private router: Router,
                private notificationService: NotificationService,
                private countryService: CountryService,
                private accountService: AccountService){
                    this.currentUser = this.accountService.parseToken();
    }

    ngOnInit(): void {
        let userName: string[] = this.currentUser.name.split(" ");

        this.customerForm = this.formBuilder.group({
            customerFirstName: [userName[0], Validators.required],
            customerLastName: [userName[1], Validators.required],
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
        this.configureHandler();
    }

    private loadOrderFromApi(): void{
        const cart = this.orderService.getCart(this.currentUser.userId);
        const countries = this.countryService.getAll();

        forkJoin(cart, countries)
            .subscribe(([ca, co]) =>{
                this.pendingOrder = ca;
                this.countries = co;
            }, err => this.notificationService.warn(errorMessage));
    }

    private configureHandler(): void{
        this.handler = StripeCheckout.configure({
            key: environment.stripeKey,
            locale: 'en',
            token: token => {
                this.showSpinner = true;
                this.callPaymentOnApi(token.id);
            }
        });
    }

    private callPaymentOnApi(token: string): void{
        let customerDetails: CustomerDetailsModel = {
            ...this.customerForm.value
        };
        customerDetails.contactEmail = this.emailForm.controls['email'].value;
        customerDetails.token = token;
        console.log(customerDetails);
        this.orderService.placeOrder(this.currentUser.userId, this.pendingOrder.id, customerDetails)
            .subscribe(() => {
                this.notificationService.success('Your order has been successfully placed.');
                this.showSpinner = false;
                this.ngOnInit();
            }, err => {
                this.notificationService.warn('Could not perform transaction.');
            });
    }

    onSubmit(): void{
        this.handler.open({
            name: 'Payment',
            description: 'Puzzle Shop',
            amount: this.pendingOrder.totalCost * 100
        });
    }

    onReturnClick = () => this.router.navigate(['/cart']);
    
}

