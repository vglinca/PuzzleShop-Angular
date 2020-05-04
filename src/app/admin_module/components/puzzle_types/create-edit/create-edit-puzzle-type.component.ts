import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PuzzleTypesService } from '../../../../services/puzzle-types.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PuzzleTypeModel } from 'src/app/models/puzzle-types/puzzle-type.model';
import { PuzzleTypeForCreationModel } from '../../../../models/puzzle-types/puzzle-type-for-creation.model';
import { PuzzleLookupService } from 'src/app/services/puzzle-lookup.service';
import { DifficultyLevelModel } from 'src/app/models/difficulty-levels/difficulty-level.model';


@Component({
    templateUrl: './create-edit-puzzle-type.component.html',
    styleUrls: ['./create-edit-puzzle-type.component.css']
})
export class CreateEditPuzzleTypeComponent implements OnInit{

    dialogTitle: string;
    puzzleTypesForm: FormGroup;
    editMode: boolean = true;

    difficultyLevels: DifficultyLevelModel[];

    constructor(@Inject(MAT_DIALOG_DATA) public puzzleTypeId: number,
                private formBuilder: FormBuilder,
                private puzzleTypesService: PuzzleTypesService,
                private lookupService: PuzzleLookupService,
                private dialogRef: MatDialogRef<CreateEditPuzzleTypeComponent>,
                public snackBar: MatSnackBar){
    }

    ngOnInit(): void {
        console.log(this.puzzleTypeId);
        if(this.puzzleTypeId === 0){
            this.dialogTitle = 'Add puzzle type';
        }else{
            this.dialogTitle = 'Edit puzzle type';
            this.getPuzzleType();
        }

        this.puzzleTypesForm = this.formBuilder.group({
            title: ['', Validators.required],
            isRubicsCube: ['', Validators.required],
            isWca: ['', Validators.required],
            difficultyLevelId: ['', Validators.required],
        });

        this.loadDifficultyLevels();
    }

    onSubmit(){
        const puzzleTypeModel: PuzzleTypeForCreationModel = this.puzzleTypesForm.value;
        if(this.puzzleTypeId > 0){
            this.puzzleTypesService.update(this.puzzleTypeId, puzzleTypeModel)
                .subscribe(() => {
                    this.resetFormCloseDialog();
                }, err => this.onErrorOccured());
        }else{
            this.puzzleTypesService.add(puzzleTypeModel)
                .subscribe(() => {
                    this.resetFormCloseDialog();
                }, err => this.onErrorOccured());
        }
    }
    
    private getPuzzleType(){
        this.puzzleTypesService.getById(this.puzzleTypeId)
            .subscribe((pt: PuzzleTypeModel) => {
                this.puzzleTypesForm.patchValue({
                    ...pt
                });
            }, err => this.onErrorOccured());
    }

    private loadDifficultyLevels(): void{
        this.lookupService.getDifficultyLevels()
        .subscribe((dl: DifficultyLevelModel[]) => this.difficultyLevels = dl);
    }

    private resetFormCloseDialog(){
        this.snackBar.open('Changes successfully applied.', 'Hide', {duration: 2000});
        this.puzzleTypesForm.reset();
        this.dialogRef.close();
    }

    private onErrorOccured(){
        this.snackBar.open('Something wrong happened during operation.', 'Hide', {duration: 2000});
    }


    closeDialog(){
        this.puzzleTypesForm.reset();
        this.dialogRef.close();
    }

}