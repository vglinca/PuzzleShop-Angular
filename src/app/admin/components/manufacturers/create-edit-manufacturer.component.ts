import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ManufacturersService } from '../../services/manufacturers.service';
import { ManufacturerForManipulationModel } from '../../models/manufacturers/manufacturer-for-manipulation.model';


@Component({
    templateUrl: './create-edit-manufacturer.component.html',
    styleUrls: ['./create-edit-manufacturer.component.css']
})
export class CreateEditManufacturerComponent implements OnInit{

    dialogTitle: string;
    form: FormGroup;
    manufacturerModel: ManufacturerForManipulationModel;

    constructor(@Inject(MAT_DIALOG_DATA) public id: number,
                private formBuilder: FormBuilder,
                private manufacturersService: ManufacturersService,
                private dialogRef: MatDialogRef<CreateEditManufacturerComponent>){
    }

    ngOnInit(): void {
        console.log(this.id);
        if(this.id === 0){
            this.dialogTitle = 'Add manufacturer';
        }else{
            this.dialogTitle = 'Edit manufacturer';
        }

        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            description: ['', [Validators.required, Validators.maxLength(1500)]]
        });
    }

    saveManufacturer(){
        this.manufacturerModel = this.form.value;
        this.manufacturersService.addNew(this.manufacturerModel)
            .subscribe(() => {
                this.form.reset();
                this.dialogRef.close();
            }, err => console.log(err));
    }
}