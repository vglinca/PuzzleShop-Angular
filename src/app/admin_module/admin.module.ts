import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManufacturersComponent } from './components/manufacturers/manufacturers.component';
import { MaterialModule } from '../material_module/material.module';
import { ManufacturersService } from './services/manufacturers.service';
import { RouterModule } from '@angular/router';
import { adminRoutes } from './admin-routes';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CreateEditManufacturerComponent } from './components/manufacturers/create-edit-manufacturer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InsteadOfEmptyStringPipe } from '../common/instead-of-empty-string.pipe';
import { ConfirmDialogService } from './shared/confirm_dialog/confirm-dialog.service';
import { ConfirmDialogComponent } from './shared/confirm_dialog/confirm-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { PuzzleTypesComponent } from './components/puzzle_types/puzzle-types.component';
import { PuzzleTypesService } from './services/puzzle-types.service';
import { CreateEditPuzzleTypeComponent } from './components/puzzle_types/create-edit-puzzle-type.component';
import { PuzzleColorsComponent } from './components/puzzle_colors/puzzle-colors.component';
import { PuzzleColorsService } from './services/puzzle-colors.service';
import { CreateEditPuzzleColorComponent } from './components/puzzle_colors/create-edit-puzzle-color.component';
import { PuzzleService } from './services/puzzle.service';
import { PuzzlesComponent } from './components/puzzles/puzzles.component';
import { ShortenStringPipe } from '../common/shorten-string.pipe';
import { CreateEditPuzzleComponent } from './components/puzzles/create-edit-puzzle.component';
import { ImagesService } from './services/images.service';



@NgModule({
  declarations: [
    ManufacturersComponent,
    CreateEditManufacturerComponent,
    PuzzleTypesComponent,
    CreateEditPuzzleTypeComponent,
    PuzzleColorsComponent,
    CreateEditPuzzleColorComponent,
    PuzzlesComponent,
    CreateEditPuzzleComponent,
    InsteadOfEmptyStringPipe,
    ShortenStringPipe,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MatIconModule,
    RouterModule.forChild(adminRoutes),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule, 
  ],
  providers:[
    ManufacturersService,
    PuzzleTypesService,
    PuzzleColorsService,
    PuzzleService,
    ImagesService,
    ConfirmDialogService
  ],
  entryComponents: [
    CreateEditManufacturerComponent,
    CreateEditPuzzleTypeComponent,
    CreateEditPuzzleColorComponent,
    ConfirmDialogComponent
  ]
})
export class AdminModule { }
