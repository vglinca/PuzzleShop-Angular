import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ValidatorFn, ValidationErrors } from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { UserForRegistrationModel } from '../../../models/users/user-for-registration.model';
import { DatePipe } from '@angular/common';
import { first } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
    templateUrl: './user-registration.component.html',
    styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit, AfterViewInit {

    passwdErrMsg: string = 'Password must contain at least 1 lowercase alphabetical character' +
        '\nat least 1 uppercase alphabetical character, \nat least 1 numeric character, \nat least one special character.';

    registrationForm: FormGroup;
    errorMessage: ErrorMessage[] = [];

    minDate = new Date(1940, 0, 1);
    maxDate = new Date(2005, 11, 31);

    constructor(private formBuilder: FormBuilder,
        private accountService: AccountService,
        private datePipe: DatePipe,
        private dialogRef: MatDialogRef<UserRegistrationComponent>,
        private notificationService: NotificationService) {   
    }
   

    ngOnInit(): void {

        this.registrationForm = this.formBuilder.group({
            username: new FormControl('', Validators.required),
            email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
            password: new FormControl('', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")]),
            confirmPassword: new FormControl('', [Validators.required]),
            firstName: new FormControl('', Validators.required),
            lastName: new FormControl('', Validators.required),
            birthDate: new FormControl('', Validators.required),
        });
    }

    ngAfterViewInit(): void {
        
    }

    register() {
        var dateOfBirth = this.datePipe.transform(this.registrationForm.value.birthDate, 'yyyy-MM-dd');

        var userDto: UserForRegistrationModel = ({
            username: this.registrationForm.value.username,
            firstName: this.registrationForm.value.firstName,
            lastName: this.registrationForm.value.lastName,
            password: this.registrationForm.value.password,
            email: this.registrationForm.value.email,
            birthDate: dateOfBirth + 'T00:00:00',
        });

        this.accountService.register(userDto)
            .pipe(first())
            .subscribe(r => {
                this.dialogRef.close();
                this.notificationService.success('Registration complete.')
            }, err => {
                console.log(err);
                err.error.forEach(e => {
                    let errMsg: ErrorMessage = {
                        code: e.code,
                        description: e.description
                    }
                    this.errorMessage.push(errMsg);
                });
                console.log(this.errorMessage);

                if(this.errorMessage.length === 1){
                    this.notificationService.warn(`User with such ${this.errorMessage[0].code === DUPLICATE_USERNAME_CODE ? 'username' : 'email'} already exists.`);
                }else if(this.errorMessage.length > 1){
                    let errString: string = '';
                    this.errorMessage.forEach(element => {
                        errString += element.description + ' ';
                    });
                    this.notificationService.warn(errString);
                }else{
                    this.notificationService.warn('Some problem has occured. Try again later.')
                }
                this.errorMessage = [];
            });
    }

    confirmPasswordCheck(control: FormControl): {[key: string]: any}{
        if(this.registrationForm.get('password').value){
            let passwd = this.registrationForm.get('password').value;
            return control.value === passwd ? null : {'confirmPasswordCheck': 'notSame'};
        }
    }

    validateFormControl(formControl): boolean {
        return formControl.untouched || formControl.valid;
    }

    onCloseClick(): void {
        this.dialogRef.close();
    }
}

const DUPLICATE_USERNAME_CODE: string = 'DuplicateUserName';
const DUPLICATE_EMAIL_CODE: string = 'DuplicateEmail';

const passwordErrorValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const password = control.get('password');
    const repeatPassword = control.get('confirmPassword');
    return password.value != repeatPassword.value ? { 'passwordError': true } : null;
};

export class ErrorMessage{
    code: string;
    description: string;
}