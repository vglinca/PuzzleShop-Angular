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


@Component({
    templateUrl: './confirm-order.component.html',
    styleUrls: ['./confirm-order.component.scss']
})
export class ConfirmOrderComponent implements OnInit{
    
    handler: any;

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
                private dialog: MatDialog,
                private notificationService: NotificationService,
                private countryService: CountryService,
                private accountService: AccountService){
                    this.currentUser = this.accountService.parseToken();
    }

    ngOnInit(): void {
        let userName: string[] = this.currentUser.name.split(" ");

        this.customerForm = this.formBuilder.group({
            firstName: [userName[0], Validators.required],
            lastName: [userName[1], Validators.required],
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
            }, err => console.log(err));
    }

    private configureHandler(): void{
        this.handler = StripeCheckout.configure({
            key: environment.stripeKey,
            locale: 'en',
            token: token => {
                console.log(token.id);
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
        this.orderService.placeOrder(this.currentUser.userId, this.pendingOrder.id, customerDetails)
            .subscribe(() => this.notificationService.success('Your order has been successfully placed.'), err => {
                this.notificationService.warn('Could not perform transaction.');
                console.log(err);
            });
    }

    onSubmit(): void{
        // this.handler.open({
        //     name: 'Payment',
        //     description: 'Puzzle Shop',
        //     amount: this.pendingOrder.totalCost * 100
        // });

        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = false;
        dialogConfig.height = "70%";
		dialogConfig.width = "500px";
		dialogConfig.data = {totalAmount: 2000};
		const dialogRef = this.dialog.open(StripePaymentComponent, dialogConfig);

		dialogRef.afterClosed()
			.subscribe((result: any) =>{
				if(result){
                    console.log('RESULT: ', result.token.id);
                    this.callPaymentOnApi(result.token.id);
				}
            });
            

        // let customer: CustomerDetailsModel = {...this.customerForm.value};
        // customer.contactEmail = this.emailForm.controls['email'].value;
        // console.log(customer);
        // this.orderService.confirmOrder(this.userId, customer)
        //     .subscribe(() => {
        //         this.router.navigate(['/payment']);
        //     }, err => console.log(err));
    }

    onReturnClick():void{
        this.router.navigate(['/cart']);
    }
}

