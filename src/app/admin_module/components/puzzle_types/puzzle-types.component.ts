import { Component, OnInit, OnDestroy } from '@angular/core';
import { PuzzleTypeModel } from 'src/app/models/puzzle-types/PuzzleTypeModel';
import { PuzzleTypesService } from '../../services/puzzle-types.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogService } from '../../shared/confirm_dialog/confirm-dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateEditPuzzleTypeComponent } from './create-edit-puzzle-type.component';
import { Subscription } from 'rxjs';


@Component({
    templateUrl: './puzzle-types.component.html',
    styleUrls: ['./puzzle-types.component.css']
})
export class PuzzleTypesComponent implements OnInit, OnDestroy{

    puzzleTypes: PuzzleTypeModel[] = [];

    dialogRefSubscr: Subscription;

    tableColumns: string[] = ['id', 'title'];

    constructor(private puzzleTypesService: PuzzleTypesService,
                private matDialog: MatDialog,
                private dialogService: ConfirmDialogService,
                public snackBar: MatSnackBar){}
    
    
    ngOnInit(): void {
        this.loadPuzzleTypes();
    }

    addEditPuzzleTypeDialog(puzzleTypeId: number){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.height = "55%";
        dialogConfig.width = "30%";
        dialogConfig.data = puzzleTypeId;
        this.matDialog.open(CreateEditPuzzleTypeComponent, dialogConfig);
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
        })
    }

    loadPuzzleTypes(){
        this.puzzleTypesService.getAll()
            .subscribe((pt : PuzzleTypeModel[]) => {
                this.puzzleTypes = pt;
                console.log(this.puzzleTypes);
            });
    }

    ngOnDestroy(): void {
        if(this.dialogRefSubscr){
            this.dialogRefSubscr.unsubscribe();
        }
    }
    
}