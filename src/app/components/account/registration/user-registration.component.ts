import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { UserForRegistrationModel } from '../../../models/users/user-for-registration.model';
import { DatePipe } from '@angular/common';
import { first } from 'rxjs/operators';
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
                private dialogRef: MatDialogRef<UserRegistrationComponent>){}
    
    ngOnInit(): void {

        this.registrationForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            birthDate: ['', Validators.required],
        });
    }

    register(){
        var dateOfBirth = this.datePipe.transform(this.registrationForm.value.birthDate, 'yyyy-MM-dd');
        
        var userDto: UserForRegistrationModel = ({
            firstName : this.registrationForm.value.firstName,
            lastName: this.registrationForm.value.lastName,
            password: this.registrationForm.value.password,
            email: this.registrationForm.value.email,
            birthDate: dateOfBirth + 'T00:00:00',
        });

        this.accountService.register(userDto)
            .pipe(first())
            .subscribe(r => {
                this.dialogRef.close();
            }, err => {
                err.error.forEach(el => {
                    this.errorMessage.push(el.code, el.description);
                    console.log(`code: ${el.code} descr: ${el.description}`);
                });
                console.log(this.errorMessage);
                
            });
    }

    validateFormControl(formControl):boolean{
        return formControl.untouched || formControl.valid;
    }
}