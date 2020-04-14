import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AccountService } from './services/account.service';
import { userForRegistrationModel } from '../models/userForRegistrationModel';
import { DatePipe } from '@angular/common';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    templateUrl: './user-registration.component.html',
    styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit{
    
    registrationForm: FormGroup;
    errorMessage: [{key: string, value: string}];

    constructor(private formBuilder: FormBuilder,
                private accountService: AccountService,
                private datePipe: DatePipe,
                private alertService: AlertService,
                private dialogRef: MatDialogRef<UserRegistrationComponent>){}
    
    ngOnInit(): void {

        this.registrationForm = this.formBuilder.group({
            userName: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(8)]],
            email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
            address: ['', Validators.required],
            birthDate: ['', Validators.required],
            phoneNumber: ['', Validators.required]
        });
    }

    register(){
        var dateOfBirth = this.datePipe.transform(this.registrationForm.value.birthDate, 'yyyy-MM-dd');
        
        var userDto: userForRegistrationModel = ({
            userName: this.registrationForm.value.userName,
            firstName : this.registrationForm.value.firstName,
            lastName: this.registrationForm.value.lastName,
            password: this.registrationForm.value.password,
            email: this.registrationForm.value.email,
            address: this.registrationForm.value.address,
            birthDate: dateOfBirth + 'T00:00:00',
            phoneNumber: this.registrationForm.value.phoneNumber
        });

        this.accountService.register(userDto)
            .pipe(first())
            .subscribe(r => {
                this.alertService.success('Registration successful', true);
                this.dialogRef.close();
            }, err => {
                err.error.forEach(el => {
                    this.errorMessage.push(el.code, el.description);
                    console.log(`code: ${el.code} descr: ${el.description}`);
                });
                console.log(this.errorMessage);
                
                this.alertService.error(err);
            });
    }

    validateFormControl(formControl):boolean{
        return formControl.untouched || formControl.valid;
    }
}