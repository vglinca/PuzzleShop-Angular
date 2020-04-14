import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Injectable()
export class ConfirmDialogService{

    constructor(private dialog: MatDialog){}

    openConfirmDialog(msg: string){
        return this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            panelClass: 'confirm-dialog-container',
            disableClose: true,
            data: {message: msg}
        });
    }
}