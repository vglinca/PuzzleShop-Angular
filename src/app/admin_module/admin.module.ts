import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManufacturersComponent } from './components/manufacturers/manufacturers-list.component';
import { MaterialModule } from '../material_module/material.module';
import { RouterModule } from '@angular/router';
import { adminRoutes } from './admin-routes';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CreateEditManufacturerComponent } from './components/manufacturers/create-edit/create-edit-manufacturer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InsteadOfEmptyStringPipe } from '../common/instead-of-empty-string.pipe';
import { ConfirmDialogService } from '../common/confirm_dialog/confirm-dialog.service';
import { ConfirmDialogComponent } from '../common/confirm_dialog/confirm-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { PuzzleTypesComponent } from './components/puzzle_types/puzzle-types-list.component';
import { CreateEditPuzzleTypeComponent } from './components/puzzle_types/create-edit/create-edit-puzzle-type.component';
import { PuzzleColorsComponent } from './components/puzzle_colors/puzzle-colors-list.component';
import { CreateEditPuzzleColorComponent } from './components/puzzle_colors/create-edit/create-edit-puzzle-color.component';
import { PuzzlesComponent } from './components/puzzles/puzzles-list.component';
import { ShortenStringPipe } from '../common/shorten-string.pipe';
import { CreateEditPuzzleComponent } from './components/puzzles/create-edit/create-edit-puzzle.component';
import { UsersListComponent } from './components/users/users-list.component';
import { UserRolesDialogComponent } from './components/users/dialog/user-roles-dialog.component';
import { OrdersListComponent } from './components/orders/orders-list.component';
import { OrderDetailsComponent } from './components/orders/order-details/order-details.component';



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
    ConfirmDialogComponent,
    UsersListComponent,
    UserRolesDialogComponent,
    OrdersListComponent,
    OrderDetailsComponent
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
    ConfirmDialogService
  ],
  entryComponents: [
    CreateEditManufacturerComponent,
    CreateEditPuzzleTypeComponent,
    CreateEditPuzzleColorComponent,
    UserRolesDialogComponent
  ]
})
export class AdminModule { }
