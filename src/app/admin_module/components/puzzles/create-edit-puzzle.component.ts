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
import { ImageForCreationModel } from '../../models/images/image-for-creation.model';


@Component({
    templateUrl: './create-edit-puzzle.component.html',
    styleUrls: ['./create-edit-puzzle.component.css']
})
export class CreateEditPuzzleComponent implements OnInit, OnDestroy
{
    dialogTitle: string;
    puzzleForm: FormGroup;

    file: File = null;

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
                private activatedRoute: ActivatedRoute){}
                
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
            });
    }

    onFileSelected(event): void{
        this.file = <File> event.target.files[0];
    }

    savePuzzle(){
        var puzzle: PuzzleForCreationModel = {
            ...this.puzzleForm.value
        };

        let fd: FormData = new FormData();

        fd.append('name', puzzle.name);
        fd.append('description', puzzle.description);
        fd.append('price', puzzle.price.toString());
        fd.append('isWcaPuzzle', puzzle.isWcaPuzzle.toString());
        fd.append('weight', puzzle.weight.toString());
        fd.append('manufacturerId', puzzle.manufacturerId.toString());
        fd.append('puzzleTypeId', puzzle.puzzleTypeId.toString());
        fd.append('colorId', puzzle.colorId.toString());
        fd.append('difficultyLevelId', puzzle.difficultyLevelId.toString());
        fd.append('materialTypeId', puzzle.materialTypeId.toString());

        fd.append('images', this.file);
        this.puzzleService.addPuzzle(fd).subscribe();

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


