import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManufacturersComponent } from './components/manufacturers/manufacturers.component';
import { MaterialModule } from '../material/material.module';
import { ManufacturersService } from './services/manufacturers.service';
import { RouterModule } from '@angular/router';
import { adminRoutes } from './admin-routes';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CreateEditManufacturerComponent } from './components/manufacturers/create-edit-manufacturer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ManufacturersComponent,
    CreateEditManufacturerComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(adminRoutes),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers:[
    ManufacturersService
  ],
  entryComponents: [CreateEditManufacturerComponent]
})
export class AdminModule { }
