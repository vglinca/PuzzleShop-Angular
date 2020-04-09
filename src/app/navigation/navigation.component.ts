import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserLoginComponent } from '../users/identity/user-login.component';

@Component({
    selector: 'nav-bar',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css']
})
export class NavigationComponent{

    rubicsCubes = ['2x2x2', '3x3x3', '4x4x4', '5x5x5'];

    constructor(private matDialog: MatDialog){}

    loginUser(){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.height = "65%";
        dialogConfig.width = "30%";
        this.matDialog.open(UserLoginComponent, dialogConfig);
    }
}