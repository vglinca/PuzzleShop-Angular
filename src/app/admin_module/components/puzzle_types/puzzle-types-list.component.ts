import { Component, OnInit, OnDestroy } from '@angular/core';
import { PuzzleTypesService } from '../../../services/puzzle-types.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogService } from '../../../common/confirm_dialog/confirm-dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateEditPuzzleTypeComponent } from './create-edit/create-edit-puzzle-type.component';
import { Subscription } from 'rxjs';
import { PuzzleTypeTableRowModel } from 'src/app/models/puzzle-types/puzzle-type-table-row.model';
import { NotificationService } from 'src/app/services/notification.service';
import { errorMessage } from 'src/app/common/consts/generic-error-message';

@Component({
    templateUrl: './puzzle-types-list.component.html',
    styleUrls: ['./puzzle-types-list.component.scss']
})
export class PuzzleTypesComponent implements OnInit, OnDestroy{

    showSpinner: boolean = true;

    puzzleTypes: PuzzleTypeTableRowModel[] = [];

    dialogRefSubscr: Subscription;
    addDialogRefSubscription: Subscription;
    subscriptions: Subscription[] = [];

    tableColumns: string[] = ['id', 'title', 'isRubicsCube', 'isWca', 'difficultyLevel'];

    constructor(private puzzleTypesService: PuzzleTypesService,
                private matDialog: MatDialog,
                private dialogService: ConfirmDialogService,
                private notificationService: NotificationService,
                public snackBar: MatSnackBar){}
    
    
    ngOnInit(): void {
        this.loadPuzzleTypes();
    }

    addEditPuzzleTypeDialog(puzzleTypeId: number){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.minWidth = '440px';
        dialogConfig.height = "55%";
        dialogConfig.width = "30%";
        dialogConfig.data = puzzleTypeId;
        const dialogRef = this.matDialog.open(CreateEditPuzzleTypeComponent, dialogConfig);
        this.addDialogRefSubscription = dialogRef.afterClosed().subscribe(a => this.loadPuzzleTypes());
        this.subscriptions.push(this.addDialogRefSubscription);
    }

    onDelete(puzzleTypeId: number, typeName: string){
        const msg: string = `Are you sure to delete this manufacturer? (${typeName})`;
        const dialogRef = this.dialogService.openConfirmDialog(msg);
        
        this.dialogRefSubscr = dialogRef.afterClosed().subscribe(action => {
            if(action === dialogRef.componentInstance.ACTION_CONFIRM){
                this.puzzleTypesService.delete(puzzleTypeId)
                    .subscribe(() => {
                        this.loadPuzzleTypes();
                        this.snackBar.open(`PuzzleType ${typeName} has been deleted from catalog.`, 'Hide', {duration: 2000});
                    },
                    err => {
                        this.snackBar.open('Something wrong happened during deletion.', 'Hide', {duration: 2000});
                    });
            }
        });
        this.subscriptions.push(this.dialogRefSubscr);
    }

    loadPuzzleTypes(){
        this.puzzleTypesService.getAll()
            .subscribe((pt : PuzzleTypeTableRowModel[]) => {
                this.puzzleTypes = pt;
                this.showSpinner = false;
            }, err => this.notificationService.warn(errorMessage));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => {
            if(s){
                s.unsubscribe();
            }
        });
    }
}