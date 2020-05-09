import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';


@Component({
    templateUrl: './stripe-payment.component.html',
    styleUrls: ['./stripe-payment.component.scss']
})
export class StripePaymentComponent implements AfterViewInit {

    @ViewChild('cardNumber') cardNumber: ElementRef;
    @ViewChild('cardExp') cardExpiry: ElementRef;
    @ViewChild('cardCvc') cardCvc: ElementRef;

    _totalAmount: number;
    card: any;
    expiry: any;
    cvc: any;
    cardHandler = this.onChange.bind(this);
    cardError: string;

    _cardNumber: FormControl = new FormControl('');

    constructor(private cd: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<StripePaymentComponent>) {
        this._totalAmount = data['totalAmount'];
    }


    ngAfterViewInit(): void {
        this.initiateCardElement();
    }

    initiateCardElement(): void {
        const cardStyle = {
            base: {
                color: '#32325d',
                fontSize: '14px',
                '::placeholder': {
                    color: 'lightgrey',
                },
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a',
            },
        };
        if(this.card == null){
            this.card = elements.create('cardNumber', {classes: {base: "inpt"}, style: {cardStyle}});
            this.card.mount(this.cardNumber.nativeElement);
            this.card.addEventListener('change', this.cardHandler);
        }
        if(this.expiry == null){
            this.expiry = elements.create('cardExpiry', {classes: {base: "cvc-exp-inpt"}, style: {cardStyle}});
            this.expiry.mount(this.cardExpiry.nativeElement);
        }
        if(this.cvc == null){
            this.cvc = elements.create('cardCvc', {classes: {base: "cvc-exp-inpt"}, style: {cardStyle}});
            this.cvc.mount(this.cardCvc.nativeElement);
        }
        

    }

    onChange({ error }): void {
        if (error) {
            this.cardError = error.message;
        } else {
            this.cardError = null;
        }
        this.cd.detectChanges();
    }

    async createStripeToken() {
        const { token, error } = await stripe.createToken(this.card);
        if (token) {
            this.onSuccess(token);
        } else {
            this.onError(error);
        }
    }

    onSuccess(token) {
        console.log('Stripe token ', token);
        this.dialogRef.close({ token });
    }
    onError(error) {
        if (error.message) {
            this.cardError = error.message;
        }
    }

}


