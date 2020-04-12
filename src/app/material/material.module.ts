import { NgModule } from '@angular/core';
import {MatButtonModule } from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatToolbarModule } from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule } from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatSelectModule} from '@angular/material/select';

const materialDesignComponents = [
      MatButtonModule, 
      MatExpansionModule,
      MatFormFieldModule,
      MatInputModule,
      MatToolbarModule, 
      MatMenuModule, 
      MatListModule, 
      MatGridListModule,
      MatIconModule,
      MatDividerModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatDialogModule,
      MatCardModule,
      MatPaginatorModule,
      MatSortModule,
      MatSelectModule
    ];

@NgModule({
  declarations: [],
  imports: [materialDesignComponents],
  exports:[materialDesignComponents]
})
export class MaterialModule { }
