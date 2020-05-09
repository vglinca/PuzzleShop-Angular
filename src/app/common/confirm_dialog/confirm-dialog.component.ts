import { Component, Inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent{

    public readonly ACTION_CONFIRM: string = 'ACTION_CONFIRM';
    public readonly ACTION_CANCEL: string = 'ACTION_CANCEL';

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private dialogRef: MatDialogRef<ConfirmDialogComponent>){
    }

    closeDialog(){
        this.dialogRef.close();
    }
}