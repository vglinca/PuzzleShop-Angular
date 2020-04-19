import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ManufacturersService } from '../../services/manufacturers.service';
import { ManufacturerModel } from 'src/app/models/manufacturers/manufacturer.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateEditManufacturerComponent } from './create-edit-manufacturer.component';
import { ConfirmDialogService } from 'src/app/admin_module/shared/confirm_dialog/confirm-dialog.service';
import { ConfirmDialogComponent } from '../../shared/confirm_dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';


@Component({
    templateUrl: './manufacturers.component.html',
    styleUrls: ['./manufacturers.component.css']
})
export class ManufacturersComponent implements OnInit, AfterViewInit, OnDestroy{

    manufacturers: ManufacturerModel[] = [];

    dialogRefSubscr: Subscription;

    tableColumns: string[] = ['id', 'name', 'description'];

    constructor(private manufacturerService: ManufacturersService,
                private matDialog: MatDialog,
                private dialogService: ConfirmDialogService,
                public snackBar: MatSnackBar){}
   
    
    
    ngOnInit(): void {
        this.loadManufacturersFromApi();
    }

    ngAfterViewInit(): void {
    }

    loadManufacturersFromApi(){
        this.manufacturerService.getAll()
            .subscribe((m : ManufacturerModel[]) => {
                this.manufacturers = m;
            }, err => console.log(err));
    }

    addEditManufacturerDialog(id: number){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.height = "65%";
        dialogConfig.width = "30%";
        dialogConfig.data = id;
        this.matDialog.open(CreateEditManufacturerComponent, dialogConfig);
    }

    onDelete(manufacturerId: number, name: string){
        const msg: string = `Are you sure to delete this manufacturer? (${name})`;
        const dialogRef = this.dialogService.openConfirmDialog(msg);

        this.dialogRefSubscr = dialogRef.afterClosed().subscribe(action => {
            if(action === dialogRef.componentInstance.ACTION_CONFIRM){
                this.manufacturerService.delete(manufacturerId).subscribe(() => {
                    this.loadManufacturersFromApi();
                    this.snackBar.open(`Manufacturer ${name} has been deleted from catalog.`, 'Hide', {duration: 2000});
                }, err => {
                    this.snackBar.open('Something wrong happened during deletion.', 'Hide', {duration: 2000});
                });
            }
        })
    }

    ngOnDestroy(): void {
        if(this.dialogRefSubscr){
            this.dialogRefSubscr.unsubscribe();
        }
    }
}

const MANUFACTURERS: ManufacturerModel[] = [
    {
        id: 1, name: 'Gan', description: ''
    },
    {
        id: 2, name: 'MoYu', description: ''
    },
    {
        id: 3, name: 'QiYi', description: ''
    },
    {
        id: 4, name: 'DaYan', description: ''
    },
    {
        id: 5, name: 'ShengShou', description: ''
    },
    {
        id: 6, name: 'SCS', description: ''
    },
    {
        id: 7, name: 'Moffangge', description: ''
    },

]