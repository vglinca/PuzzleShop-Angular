import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ManufacturersService } from '../../../services/manufacturers.service';
import { PuzzleTypesService } from '../../../services/puzzle-types.service';
import { PuzzleColorsService } from '../../../services/puzzle-colors.service';
import { PuzzleService } from '../../../services/puzzle.service';
import { PuzzleLookupService } from 'src/app/services/puzzle-lookup-service';
import { ManufacturerModel } from 'src/app/models/manufacturers/manufacturer.model';
import { PuzzleTypeModel } from 'src/app/models/puzzle-types/puzzle-type.model';
import { PuzzleColorModel } from 'src/app/models/puzzle-colors/puzzle-color.model';
import { MaterialTypeModel } from 'src/app/models/material-types/material-type.model';
import { DifficultyLevelModel } from 'src/app/models/difficulty-levels/difficulty-level.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PuzzleModel } from 'src/app/models/puzzles/puzzle.model';
import { PuzzleForCreationModel } from '../../../models/puzzles/puzzle-for-creation.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImagesService } from '../../../services/images.service';
import { PuzzleForUpdateModel } from '../../../models/puzzles/puzzle-for-update.model';
import { environment } from 'src/environments/environment';
import { PuzzleTypeTableRowModel } from 'src/app/models/puzzle-types/puzzle-type-table-row.model';


@Component({
    templateUrl: './create-edit-puzzle.component.html',
    styleUrls: ['./create-edit-puzzle.component.css']
})
export class CreateEditPuzzleComponent implements OnInit, OnDestroy, AfterViewInit
{
    dialogTitle: string;
    puzzleForm: FormGroup;
    puzzleId: number;

    file: File;
    imageFiles: Array<File> = new Array<File>();

    urls: Array<string> = new Array<string>();

    imageIdsToDelete: Array<number> = new Array<number>();

    puzzleModel: PuzzleModel;
    staticFilesUrl: string = environment.staticFilesUrl;

    routerSubscription: Subscription;
    subscriptions: Subscription[] = [];

    manufacturers: ManufacturerModel[];
    puzzleTypes: PuzzleTypeTableRowModel[];
    puzzleColors: PuzzleColorModel[];
    materialTypes: MaterialTypeModel[];

    constructor(private manufacturerService: ManufacturersService,
                private puzzleTypeService: PuzzleTypesService,
                private puzzleColorService: PuzzleColorsService,
                private lookupService: PuzzleLookupService,
                private puzzleService: PuzzleService,
                private imagesService: ImagesService,
                private formBuilder: FormBuilder,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                public snackbar: MatSnackBar){
                    this.imageIdsToDelete = [];
                }


    ngAfterViewInit(): void {
    }
                
    ngOnInit(): void {
        this.routerSubscription = this.activatedRoute.params.subscribe(param => {
            this.puzzleId = +param['id'];
            if(this.puzzleId === -1){
                this.dialogTitle = 'Add new puzzle';
            }else{
                this.dialogTitle = 'Edit puzzle';
                this.loadPuzzle();
            }
        });

        this.puzzleForm = this.formBuilder.group({
            name: ['', Validators.required],
            description: ['', [Validators.required, Validators.maxLength(1500)]],
            price: ['', Validators.required],
            isMagnetic: ['', Validators.required],
            weight: ['', Validators.required],
            manufacturerId: ['', Validators.required],
            puzzleTypeId: ['', Validators.required],
            colorId: ['', Validators.required],
            materialTypeId: ['', Validators.required]
        });
                             
        this.loadAllProperties();

    }
           
    private loadAllProperties(){
        this.loadManufacturers();
        this.loadPuzzleTypes();
        this.loadPuzzleColors();
        this.loadMaterialTypes();
    }

    private loadPuzzle():void{
        this.puzzleService.getPuzzle(this.puzzleId)
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

        this.urls = [];
        if(this.imageFiles){
            for(let file of this.imageFiles){
                let reader = new FileReader();
                reader.onload = e => {
                   this.urls.push(<string>e.target.result);
                }
                reader.readAsDataURL(file);
            }
        }
    }

    onImageClicked(event): void{
        console.log(event);
    }

    onDeleteImage(imageId: number): void{
        console.log(imageId);
        this.imageIdsToDelete.push(imageId);
    }

    saveChanges(){
        
        if(this.puzzleId === -1){

            let puzzle: PuzzleForCreationModel = {
                ...this.puzzleForm.value
            };

            let fd: FormData = new FormData();
            puzzle.price = puzzle.price.toString().replace('\.', ',');
    
            fd.append('name', puzzle.name);
            fd.append('description', puzzle.description);
            fd.append('price', puzzle.price);
            fd.append('isMagnetic', puzzle.isMagnetic);
            fd.append('weight', puzzle.weight);
            fd.append('manufacturerId', puzzle.manufacturerId);
            fd.append('puzzleTypeId', puzzle.puzzleTypeId);
            fd.append('colorId', puzzle.colorId);
            fd.append('materialTypeId', puzzle.materialTypeId);
    
            for(let file of this.imageFiles){
                fd.append('images', file);
            }
    
            this.puzzleService.addPuzzle(fd)
                .subscribe(() => {
                    this.onChangesApplied();
                }, err => {
                    this.onProblemsOccured('Some problems occured during saving new puzzle.');
                    console.log(err);
                });
        }else{
            let editedPuzzle: PuzzleForUpdateModel = {
                ...this.puzzleForm.value
            };
            
            if(this.imageFiles.length > 0){
                let reqFormData: FormData = new FormData();
                for(let img of this.imageFiles){
                    reqFormData.append('id', '0');
                    reqFormData.append('title', editedPuzzle.name);
                    reqFormData.append('file', img);
                    this.imagesService.addImages(this.puzzleId, reqFormData)
                        .subscribe(() => {},
                        err => {
                            this.onProblemsOccured('Could not add image.')
                            console.log(err)
                        });
                }
            }

            if(this.imageIdsToDelete.length > 0){
                this.imagesService.deleteImages(this.puzzleId, this.imageIdsToDelete)
                    .subscribe(() => {
                    }, err => {
                        this.onProblemsOccured('Could not perform operation of deleting images.');;
                    });
            }

            this.puzzleService.updatePuzzle(this.puzzleId, editedPuzzle)
                .subscribe(() => {
                    this.onChangesApplied();
                }, err => this.onProblemsOccured('Could not update puzzle.'));
        }
    }

    private onChangesApplied(): void{
        this.snackbar.open('Puzzle has been successfully added.', 'Hide', {duration: 2000});
        this.puzzleForm.reset();
        this.router.navigate(['/administration/puzzles']);
    }

    private onProblemsOccured(msg: string){
        this.snackbar.open(msg, 'Hide', {duration: 2000});
    }
                
    private loadManufacturers(): void{
        this.manufacturerService.getAll()
            .subscribe((m: ManufacturerModel[]) => this.manufacturers = m);
    }
                
    private loadPuzzleTypes(): void{
        this.puzzleTypeService.getAll()
            .subscribe((pt: PuzzleTypeTableRowModel[]) => {
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
    
    

    ngOnDestroy(): void {
        this.subscriptions.forEach((s: Subscription) => {
            if(s){
                s.unsubscribe();
            }
        });
    }
}


