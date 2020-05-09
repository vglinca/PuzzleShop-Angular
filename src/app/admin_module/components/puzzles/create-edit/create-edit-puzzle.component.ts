import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, ElementRef, QueryList, Renderer2, DoCheck, Directive } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ManufacturersService } from '../../../../services/manufacturers.service';
import { PuzzleTypesService } from '../../../../services/puzzle-types.service';
import { PuzzleColorsService } from '../../../../services/puzzle-colors.service';
import { PuzzleService } from '../../../../services/puzzle.service';
import { PuzzleLookupService } from 'src/app/services/lookup.service';
import { ManufacturerModel } from 'src/app/models/manufacturers/manufacturer.model';
import { PuzzleColorModel } from 'src/app/models/puzzle-colors/puzzle-color.model';
import { MaterialTypeModel } from 'src/app/models/material-types/material-type.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { PuzzleModel } from 'src/app/models/puzzles/puzzle.model';
import { PuzzleForCreationModel } from '../../../../models/puzzles/puzzle-for-creation.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImagesService } from '../../../../services/images.service';
import { PuzzleForUpdateModel } from '../../../../models/puzzles/puzzle-for-update.model';
import { environment } from 'src/environments/environment';
import { PuzzleTypeTableRowModel } from 'src/app/models/puzzle-types/puzzle-type-table-row.model';

@Directive({
    selector: '.image-item'
})
export class ImageItemElement {
}

@Component({
    templateUrl: './create-edit-puzzle.component.html',
    styleUrls: ['./create-edit-puzzle.component.css']
})
export class CreateEditPuzzleComponent implements OnInit, OnDestroy, AfterViewInit, DoCheck {
    dialogTitle: string;
    puzzleForm: FormGroup;
    puzzleId: number;

    imageOpacity: number = 1;

    file: File;
    imageFiles: Array<File> = new Array<File>();

    urls: Array<string> = new Array<string>();

    imageIdsToDelete: Array<number> = new Array<number>();
    imagesToDelete: Array<ImageDictionary> = new Array<ImageDictionary>();

    isDeletingImages: boolean = false;

    @ViewChildren('element', { read: ElementRef }) images: QueryList<ElementRef>;

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
        public snackbar: MatSnackBar,
        private renderer: Renderer2) {
        this.imageIdsToDelete = [];
    }
    ngDoCheck(): void {
    }


    ngAfterViewInit(): void {

        setTimeout(() => {

            this.images.forEach((element: ElementRef) => {
                element.nativeElement.addEventListener('click', (event) => {

                    let target = this.imagesToDelete.find(img => img.imageId === +event.target.alt);
                    target.deleteMode = !target.deleteMode;

                    if (target.deleteMode) {
                        this.renderer.setStyle(element.nativeElement.children[0], 'opacity', '0.3');
                    } else {
                        this.renderer.setStyle(element.nativeElement.children[0], 'opacity', '1.0');
                    }
                });
            });
        }, 1000);
    }

    ngOnInit(): void {
        this.routerSubscription = this.activatedRoute.params.subscribe(param => {
            this.puzzleId = +param['id'];
            if (this.puzzleId === -1) {
                this.dialogTitle = 'Add new puzzle';
            } else {
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
            materialTypeId: ['', Validators.required],
            availableInStock: ['', Validators.required]
        });

        this.loadAllProperties();
    }

    private loadAllProperties() {
        const manufacturers = this.manufacturerService.getAll();
        const puzzleTypes =  this.puzzleTypeService.getAll();
        const puzzleColors = this.puzzleColorService.getAll();
        const materialTypes = this.lookupService.getMaterialTypes();

        forkJoin(manufacturers, puzzleTypes, puzzleColors, materialTypes)
            .subscribe(([m, pt, pc, mt]) => {
                this.manufacturers = m;
                this.puzzleTypes = pt;
                this.puzzleColors = pc;
                this.materialTypes = mt;
            });

        //this.loadManufacturers();
        //this.loadPuzzleTypes();
        //this.loadPuzzleColors();
        //this.loadMaterialTypes();
    }

    private loadPuzzle(): void {
        this.puzzleService.getPuzzle(this.puzzleId)
            .subscribe((p: PuzzleModel) => {
                this.puzzleForm.patchValue({...p});
                this.puzzleForm.controls['isMagnetic'].setValue(p.isMagnetic ? 'true' : 'false');
                this.puzzleModel = p;
                this.puzzleModel.images.forEach(image => {
                    console.log(image.id);
                    var imageDictionary = new ImageDictionary(image.id);
                    this.imagesToDelete.push(imageDictionary);
                });
            });
    }

    onFileSelected(event): void {
        this.file = <File>event.target.files[0];
        this.imageFiles = <File[]>event.target.files;

        this.urls = [];
        if (this.imageFiles) {
            for (let file of this.imageFiles) {
                let reader = new FileReader();
                reader.onload = e => {
                    this.urls.push(<string>e.target.result);
                }
                reader.readAsDataURL(file);
            }
        }
    }

    onDeleteImage(): void {
        this.imagesToDelete.forEach(element => {
            if (element.deleteMode) {
                this.imageIdsToDelete.push(element.imageId);
            }
        });
        if (this.imageIdsToDelete.length > 0) {
            this.imagesService.deleteImages(this.puzzleId, this.imageIdsToDelete)
                .subscribe(() => {
                    this.snackbar.open('Images has been successfully deleted.', 'Hide', { duration: 1500 });
                    this.puzzleForm.reset();
                    this.ngOnInit();
                }, err => {
                    this.onProblemsOccured('Could not perform operation of deleting images.');;
                });
        } else {
            this.snackbar.open('Select at least one image to perform deletion.', 'Hide', { duration: 1500 });
        }
    }

    saveChanges() {

        if (this.puzzleId === -1) {

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
            fd.append('availableInStock', puzzle.availableInStock);

            for (let file of this.imageFiles) {
                fd.append('images', file);
            }

            this.puzzleService.addPuzzle(fd)
                .subscribe(() => {
                    this.onChangesApplied();
                }, err => {
                    this.onProblemsOccured('Some problems occured during saving new puzzle.');
                    console.log(err);
                });
        } else {
            let editedPuzzle: PuzzleForUpdateModel = {
                ...this.puzzleForm.value
            };

            if (this.imageFiles.length > 0) {
                for (let img of this.imageFiles) {
                    let reqFormData: FormData = new FormData();
                    reqFormData.append('id', '0');
                    reqFormData.append('title', editedPuzzle.name);
                    reqFormData.append('file', img);
                    this.imagesService.addImages(this.puzzleId, reqFormData)
                        .subscribe(() => { },
                            err => {
                                this.onProblemsOccured('Could not add image.')
                                console.log(err)
                            });
                }
            }


            this.puzzleService.updatePuzzle(this.puzzleId, editedPuzzle)
                .subscribe(() => {
                    this.onChangesApplied();
                }, err => this.onProblemsOccured('Could not update puzzle.'));
        }
    }

    private onChangesApplied(): void {
        this.snackbar.open('Puzzle has been successfully added.', 'Hide', { duration: 2000 });
        this.puzzleForm.reset();
        this.router.navigate(['/administration/puzzles']);
    }

    private onProblemsOccured(msg: string) {
        this.snackbar.open(msg, 'Hide', { duration: 2000 });
    }

    private loadManufacturers(): void {
        this.manufacturerService.getAll()
            .subscribe((m: ManufacturerModel[]) => this.manufacturers = m);
    }

    private loadPuzzleTypes(): void {
        this.puzzleTypeService.getAll()
            .subscribe((pt: PuzzleTypeTableRowModel[]) => {
                this.puzzleTypes = pt;
                console.log(this.puzzleTypes);
            });
    }

    private loadPuzzleColors(): void {
        this.puzzleColorService.getAll()
            .subscribe((c: PuzzleColorModel[]) => this.puzzleColors = c);
    }

    private loadMaterialTypes(): void {
        this.lookupService.getMaterialTypes()
            .subscribe((mt: MaterialTypeModel[]) => this.materialTypes = mt);
    }



    ngOnDestroy(): void {
        this.subscriptions.forEach((s: Subscription) => {
            if (s) {
                s.unsubscribe();
            }
        });
    }
}

export class ImageDictionary {
    imageId: number;
    deleteMode: boolean;

    constructor(id: number) {
        this.imageId = id;
        this.deleteMode = false;
    }
}
