import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserRegistrationComponent } from './user-registration.component';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';

@Component({
    templateUrl: './user-login.component.html',
    styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit{

    userLoginForm: FormGroup;

    constructor(
        private dialogRef: MatDialogRef<UserLoginComponent>,
        private builder: FormBuilder,
        private dialog: MatDialog){}
    
    ngOnInit(): void {
        this.userLoginForm = this.builder.group({
            userName: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    login(){
        console.log(this.userLoginForm.value);
        this.dialogRef.close();
    }

    redirectToRegistration(){
        this.dialogRef.close();
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.height = "85%";
        dialogConfig.width = "30%";
        this.dialog.open(UserRegistrationComponent, dialogConfig);
    }
}