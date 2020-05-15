import { Component, OnInit, OnDestroy } from '@angular/core';
import { PuzzleColorModel } from 'src/app/models/puzzle-colors/puzzle-color.model';
import { PuzzleColorsService } from '../../../services/puzzle-colors.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogService } from '../../../common/confirm_dialog/confirm-dialog.service';
import { CreateEditPuzzleColorComponent } from './create-edit/create-edit-puzzle-color.component';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './puzzle-colors-list.component.html',
    styleUrls: ['./puzzle-colors-list.component.scss']
})
export class PuzzleColorsComponent implements OnInit, OnDestroy{

    showSpinner: boolean = true;

    puzzleColors: PuzzleColorModel[] = [];

    dialogRefSubscr: Subscription;
    addDialogRefSubscription: Subscription;
    subscriptions: Subscription[] = [];

    tableColumns: string[] = ['id', 'title'];

    constructor(private puzzleColorService: PuzzleColorsService,
        private matDialog: MatDialog,
        private dialogService: ConfirmDialogService,
        public snackBar: MatSnackBar){}
   
    ngOnInit(): void {
        this.loadPuzzleColors();
    }

    openDialogForEditOrCreate(colorId: number): void{
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.minWidth = '440px';
        dialogConfig.height = "55%";
        dialogConfig.width = "30%";
        dialogConfig.data = colorId;
        const dialogRef = this.matDialog.open(CreateEditPuzzleColorComponent, dialogConfig);
        this.addDialogRefSubscription = dialogRef.afterClosed().subscribe(a => this.loadPuzzleColors());
        this.subscriptions.push(this.addDialogRefSubscription);
    }

    onDelete(colorId: number, color: string): void{
        const msg: string = `Are you sure to delete this color? (${color})`;
        const dialogRef = this.dialogService.openConfirmDialog(msg);

        this.dialogRefSubscr = dialogRef.afterClosed().subscribe(action => {
            if(action === dialogRef.componentInstance.ACTION_CONFIRM){
                this.puzzleColorService.delete(colorId)
                    .subscribe(() => {
                        this.loadPuzzleColors();
                        this.snackBar.open(`PuzzleType ${color} has been deleted from catalog.`, 'Hide', {duration: 2000});
                    }, err => {
                        this.snackBar.open('Something wrong happened during deletion.', 'Hide', {duration: 2000});
                    });
            }
        });
        this.subscriptions.push(this.dialogRefSubscr);
    }

    loadPuzzleColors(): void{
        this.puzzleColorService.getAll()
            .subscribe((pc: PuzzleColorModel[]) => {
                this.puzzleColors = pc;
                this.showSpinner = false;
            });
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => {
            if(s){
                s.unsubscribe();
            }
        });
    }
}