import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ManufacturersService } from '../../services/manufacturers.service';
import { ManufacturerModel } from 'src/app/models/manufacturers/ManufacturerModel';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateEditManufacturerComponent } from './create-edit-manufacturer.component';


@Component({
    templateUrl: './manufacturers.component.html',
    styleUrls: ['./manufacturers.component.css']
})
export class ManufacturersComponent implements OnInit, AfterViewInit{

    manufacturers: ManufacturerModel[] = [];

    tableColumns: string[] = ['id', 'name', 'description'];

    constructor(private manufacturerService: ManufacturersService,
                private matDialog: MatDialog){}
    
    
    ngOnInit(): void {
        this.loadManufacturersFromApi();
    }

    ngAfterViewInit(): void {
    }

    private loadManufacturersFromApi(){
        this.manufacturerService.getAll()
            .subscribe((m : ManufacturerModel[]) => {
                this.manufacturers = m;
            }, err => console.log(err));
    }

    addEditManufacturerDialog(id: number){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.height = "65%";
        dialogConfig.width = "30%";
        dialogConfig.data = id;
        this.matDialog.open(CreateEditManufacturerComponent, dialogConfig);
    }
}