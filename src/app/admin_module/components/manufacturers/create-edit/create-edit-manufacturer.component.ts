import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ManufacturersService } from '../../../../services/manufacturers.service';
import { ManufacturerForManipulationModel } from '../../../../models/manufacturers/manufacturer-for-manipulation.model';
import { ManufacturerModel } from 'src/app/models/manufacturers/manufacturer.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from 'src/app/services/notification.service';
import { errorMessage, couldNotLoadResource } from 'src/app/common/consts/generic-error-message';


@Component({
    templateUrl: './create-edit-manufacturer.component.html',
    styleUrls: ['./create-edit-manufacturer.component.scss']
})
export class CreateEditManufacturerComponent implements OnInit{

    dialogTitle: string;
    form: FormGroup;

    constructor(@Inject(MAT_DIALOG_DATA) public id: number,
                private formBuilder: FormBuilder,
                private notificationService: NotificationService,
                private manufacturersService: ManufacturersService,
                private dialogRef: MatDialogRef<CreateEditManufacturerComponent>,
                public snackBar: MatSnackBar){
    }

    ngOnInit(): void {
        console.log(this.id);
        if(this.id === 0){
            this.dialogTitle = 'Add manufacturer';
        }else{
            this.dialogTitle = 'Edit manufacturer';
            this.getManufacturer();
        }

        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            description: ['', [Validators.required, Validators.maxLength(1500)]]
        });
    }

    closeDialog(){
        this.form.reset();
        this.dialogRef.close();
    }

    saveManufacturer(): void{
        const manufacturerModel: ManufacturerForManipulationModel = this.form.value;
        if(this.id > 0){
            this.manufacturersService.update(this.id, manufacturerModel)
                .subscribe(() => {
                    this.resetFormCloseDialog();
                }, err => this.onErrorOccured());
        }else{
            this.manufacturersService.addNew(manufacturerModel)
                .subscribe(() => {
                    this.resetFormCloseDialog();
                }, err => this.onErrorOccured());
        }
    }

    private onErrorOccured = () => this.snackBar.open('Something wrong happened during operation.', 'Hide', {duration: 2000});
    
    private resetFormCloseDialog(){
        this.snackBar.open('Changes successfully applied.', 'Hide', {duration: 2000});
        this.form.reset();
        this.dialogRef.close();
    }

    private getManufacturer(): void{
        this.manufacturersService.getbyId(this.id).subscribe((manufacturer: ManufacturerModel) => {
            this.form.patchValue({
                ...manufacturer
            });
        }, err => this.notificationService.warn(couldNotLoadResource));
    }
}