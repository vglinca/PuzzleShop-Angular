import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';

const materialDesignComponents = [
      MatButtonModule, 
      MatExpansionModule,
      MatToolbarModule, 
      MatMenuModule, 
      MatListModule, 
      MatGridListModule,
      MatIconModule,
      MatDividerModule
    ];

@NgModule({
  declarations: [],
  imports: [materialDesignComponents],
  exports:[materialDesignComponents]
})
export class MaterialModule { }
