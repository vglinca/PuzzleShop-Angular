import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
    templateUrl: './stripe-payment.component.html',
    styleUrls: ['./stripe-payment.component.scss']
})
export class StripePaymentComponent implements AfterViewInit, OnDestroy {

    @ViewChild('cardInfo') cardInfo: ElementRef;

    _totalAmount: number;
    card: any;
    cardHandler = this.onChange.bind(this);
    cardError: string;
    
    constructor(private cd: ChangeDetectorRef,
                @Inject(MAT_DIALOG_DATA) private data: any,
                private dialogRef: MatDialogRef<StripePaymentComponent>) {
        this._totalAmount = data['totalAmount'];
    }


    ngAfterViewInit(): void {
        this.initiateCardElement();
    }

    initiateCardElement(): void {
        // Giving a base style here, but most of the style is in scss file
        const cardStyle = {
            base: {
                color: '#32325d',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a',
            },
        };
        this.card = elements.create('card', { cardStyle });
        this.card.mount(this.cardInfo.nativeElement);
        this.card.addEventListener('change', this.cardHandler);
    }

    onChange({ error }): void {
        if (error) {
            this.cardError = error.message;
        } else {
            this.cardError = null;
        }
        this.cd.detectChanges();
    }

    async createStripeToken(){
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

    ngOnDestroy(): void {
    }
}