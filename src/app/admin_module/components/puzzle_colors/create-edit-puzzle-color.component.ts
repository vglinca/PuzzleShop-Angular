import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PuzzleColorsService } from '../../services/puzzle-colors.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PuzzleColorModel } from 'src/app/models/puzzle-colors/PuzzleColorModel';
import { PuzzleColorForCreationModel } from '../../models/puzzle_colors/puzzle-color-for-creation.model';

  
  @Component({
      templateUrl:'./create-edit-puzzle-color.component.html',
      styleUrls: ['./create-edit-puzzle-color.component.css']
  })
  export class CreateEditPuzzleColorComponent implements OnInit{

    dialogTitle: string;
    puzzleColorForm: FormGroup;

    constructor(@Inject(MAT_DIALOG_DATA) public colorId: number,
                private formBuilder: FormBuilder,
                private puzzleColorService: PuzzleColorsService,
                private dialogRef: MatDialogRef<CreateEditPuzzleColorComponent>,
                public snackBar: MatSnackBar){
    }

    ngOnInit(): void {
      if(this.colorId === -1){
        this.dialogTitle = 'Add color';
      }else{
        this.dialogTitle = 'Edit color';
        this.getPuzzleColor();
      }

      this.puzzleColorForm = this.formBuilder.group({
        title: ['', Validators.required]
      });
    }

    onSubmit(){
      const puzzleColorModel: PuzzleColorForCreationModel = this.puzzleColorForm.value;
      if(this.colorId === -1){
        this.puzzleColorService.add(puzzleColorModel)
          .subscribe(() => {
            this.resetFormCloseDialog();
          }, err => this.onErrorOccured());
      }else{
        this.puzzleColorService.update(this.colorId, puzzleColorModel)
          .subscribe(() => {
            this.resetFormCloseDialog();
          }, err => this.onErrorOccured());
      }
    }

    private getPuzzleColor(): void{
      this.puzzleColorService.getById(this.colorId)
        .subscribe((pc : PuzzleColorModel) => {
          this.puzzleColorForm.patchValue({
            ...pc
          });
        }, err => this.onErrorOccured());
    }

    private resetFormCloseDialog(){
      this.snackBar.open('Changes successfully applied.', 'Hide', {duration: 2000});
      this.puzzleColorForm.reset();
      this.dialogRef.close();
  }

    private onErrorOccured(){
      this.snackBar.open('Something wrong happened during operation.', 'Hide', {duration: 2000});
    }


    closeDialog(){
      this.puzzleColorForm.reset();
      this.dialogRef.close();
    }

  }