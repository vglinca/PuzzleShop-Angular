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
import { AppModule } from '../app.module';
import { ConfirmDialogService } from './shared/confirm_dialog/confirm-dialog.service';
import { ConfirmDialogComponent } from './shared/confirm_dialog/confirm-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { PuzzleTypesComponent } from './components/puzzle_types/puzzle-types.component';
import { PuzzleTypesService } from './services/puzzle-types.service';
import { CreateEditPuzzleTypeComponent } from './components/puzzle_types/create-edit-puzzle-type.component';



@NgModule({
  declarations: [
    ManufacturersComponent,
    CreateEditManufacturerComponent,
    PuzzleTypesComponent,
    CreateEditPuzzleTypeComponent,
    InsteadOfEmptyStringPipe,
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
    ConfirmDialogService
  ],
  entryComponents: [
    CreateEditManufacturerComponent,
    CreateEditPuzzleTypeComponent,
    ConfirmDialogComponent]
})
export class AdminModule { }
