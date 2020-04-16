import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ManufacturersService } from '../../services/manufacturers.service';
import { PuzzleTypesService } from '../../services/puzzle-types.service';
import { PuzzleColorsService } from '../../services/puzzle-colors.service';
import { PuzzleService } from '../../services/puzzle.service';
import { PuzzleLookupService } from 'src/app/services/puzzle-lookup-service';
import { ManufacturerModel } from 'src/app/models/manufacturers/ManufacturerModel';
import { PuzzleTypeModel } from 'src/app/models/puzzle-types/PuzzleTypeModel';
import { PuzzleColorModel } from 'src/app/models/puzzle-colors/PuzzleColorModel';
import { MaterialTypeModel } from 'src/app/models/material-types/material-type.model';
import { DifficultyLevelModel } from 'src/app/models/difficulty-levels/difficulty-level.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PuzzleModel } from 'src/app/models/puzzles/PuzzleModel';
import { PuzzleForCreationModel } from '../../models/puzzles/puzzle-for-creation.model';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
    templateUrl: './create-edit-puzzle.component.html',
    styleUrls: ['./create-edit-puzzle.component.css']
})
export class CreateEditPuzzleComponent implements OnInit, OnDestroy
{
    dialogTitle: string;
    puzzleForm: FormGroup;

    file: File;
    imageFiles: File[] = [];

    puzzleModel: PuzzleModel;
    staticFilesUrl: string = 'http://localhost:5000/images/';

    routerSubscription: Subscription;
    subscriptions: Subscription[] = [];

    manufacturers: ManufacturerModel[];
    puzzleTypes: PuzzleTypeModel[];
    puzzleColors: PuzzleColorModel[];
    materialTypes: MaterialTypeModel[];
    difficultyLevels: DifficultyLevelModel[];

    constructor(private manufacturerService: ManufacturersService,
                private puzzleTypeService: PuzzleTypesService,
                private puzzleColorService: PuzzleColorsService,
                private lookupService: PuzzleLookupService,
                private puzzleService: PuzzleService,
                private formBuilder: FormBuilder,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                public snackbar: MatSnackBar){}
                
    ngOnInit(): void {
        var puzzleId: number;
        this.routerSubscription = this.activatedRoute.params.subscribe(param => {
            puzzleId = +param['id'];
            if(puzzleId === -1){
                this.dialogTitle = 'Add new puzzle';
            }else{
                this.dialogTitle = 'Edit puzzle';
                this.loadPuzzle(puzzleId);
            }
        });

        this.puzzleForm = this.formBuilder.group({
            name: ['', Validators.required],
            description: ['', [Validators.required, Validators.maxLength(1500)]],
            price: ['', Validators.required],
            isWcaPuzzle: ['', Validators.required],
            weight: ['', Validators.required],
            manufacturerId: ['', Validators.required],
            puzzleTypeId: ['', Validators.required],
            colorId: ['', Validators.required],
            difficultyLevelId: ['', Validators.required],
            materialTypeId: ['', Validators.required]
        });
                    
                    
        this.loadAllProperties();
    }
                
    private loadAllProperties(){
        this.loadManufacturers();
        this.loadPuzzleTypes();
        this.loadPuzzleColors();
        this.loadMaterialTypes();
        this.loadDifficultyLevels();
    }

    private loadPuzzle(puzzleId: number):void{
        this.puzzleService.getPuzzle(puzzleId)
            .subscribe((p: PuzzleModel) => {
                this.puzzleForm.patchValue({
                    ...p
                });
                this.puzzleModel = p;
            });
    }

    onFileSelected(event): void{
        this.file = <File> event.target.files[0];
        this.imageFiles = <File[]> event.target.files;
    }

    savePuzzle(){
        var puzzle: PuzzleForCreationModel = {
            ...this.puzzleForm.value
        };

        let fd: FormData = new FormData();

        puzzle.price = puzzle.price.toString().replace('\.', ',');

        fd.append('name', puzzle.name);
        fd.append('description', puzzle.description);
        fd.append('price', puzzle.price);
        fd.append('isWcaPuzzle', puzzle.isWcaPuzzle);
        fd.append('weight', puzzle.weight);
        fd.append('manufacturerId', puzzle.manufacturerId);
        fd.append('puzzleTypeId', puzzle.puzzleTypeId);
        fd.append('colorId', puzzle.colorId);
        fd.append('difficultyLevelId', puzzle.difficultyLevelId);
        fd.append('materialTypeId', puzzle.materialTypeId);
        for(let file of this.imageFiles){
            fd.append('images', file);
        }

        this.puzzleService.addPuzzle(fd)
            .subscribe(() => {
                this.onChangesApplied();
            }, err => {
                this.onProblemsOccured();
                console.log(err);
            });
    }

    private onChangesApplied(): void{
        this.snackbar.open('Puzzle has been successfully added.', 'Hide', {duration: 2000});
        this.puzzleForm.reset();
        this.router.navigate(['/administration/puzzles']);
    }

    private onProblemsOccured(){
        this.snackbar.open('Some problems occured during saving puzzle.', 'Hide', {duration: 2000});
    }
                
    private loadManufacturers(): void{
        this.manufacturerService.getAll()
            .subscribe((m: ManufacturerModel[]) => this.manufacturers = m);
    }
                
    private loadPuzzleTypes(): void{
        this.puzzleTypeService.getAll()
            .subscribe((pt: PuzzleTypeModel[]) => {
                this.puzzleTypes = pt;
                console.log(this.puzzleTypes);
            });
    }
    
    private loadPuzzleColors(): void{
        this.puzzleColorService.getAll()
        .subscribe((c: PuzzleColorModel[]) => this.puzzleColors = c);
    }
    
    private loadMaterialTypes(): void{
        this.lookupService.getMaterialTypes()
        .subscribe((mt: MaterialTypeModel[]) => this.materialTypes = mt);
    }
    
    private loadDifficultyLevels(): void{
        this.lookupService.getDifficultyLevels()
        .subscribe((dl: DifficultyLevelModel[]) => this.difficultyLevels = dl);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((s: Subscription) => {
            if(s){
                s.unsubscribe();
            }
        });
    }
}


