import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserRegistrationComponent } from '../registration/user-registration.component';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';
import { AccountService } from 'src/app/services/account.service';
import { UserForAuthModel } from 'src/app/models/users/user-for-auth.model';
import { BearerToken } from 'src/app/models/users/jwt-bearer-token';
import { environment } from 'src/environments/environment';
import { NotificationService } from 'src/app/services/notification.service';
import * as jwt_decode from 'jwt-decode';
import { LoggedInUserInfo } from 'src/app/models/users/logged-in-user-info';
import { Router } from '@angular/router';

@Component({
    templateUrl: './user-login.component.html',
    styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit{

    userLoginForm: FormGroup;

    constructor(
        private accountService: AccountService,
        private notificationService: NotificationService,
        private dialogRef: MatDialogRef<UserLoginComponent>,
        private router: Router,
        private builder: FormBuilder,
        private dialog: MatDialog){}
    
    ngOnInit(): void {
        this.userLoginForm = this.builder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    onCloseClick(): void{
        this.dialogRef.close();
    }

    login(){
        const userForLogin: UserForAuthModel = {...this.userLoginForm.value};
        this.accountService.login(userForLogin)
            .subscribe((bearerToken: BearerToken) => {
                localStorage.setItem(environment.accessToken, bearerToken.accessToken);
                let decodeToken = jwt_decode(bearerToken.accessToken);
                let userInfo: LoggedInUserInfo = this.accountService.parseToken();
                this.notificationService.success('You have logged in a system.');
            }, err => {
                this.notificationService.warn(err.error.Error)
            });
        this.dialogRef.close();
    }

    redirectToRegistration(){
        this.dialogRef.close();
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = false;
        dialogConfig.height = "85%";
        dialogConfig.width = "35%";
        this.dialog.open(UserRegistrationComponent, dialogConfig);
    }

    validateFormControl(formControl):boolean{
        return formControl.untouched || formControl.valid;
    }
}