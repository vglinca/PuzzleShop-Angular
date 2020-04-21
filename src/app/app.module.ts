import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material_module/material.module';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app-routes';
import { UsersModule } from './users_module/users.module';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { PuzzleLookupService } from './services/puzzle-lookup-service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { PuzzleThumbnailComponent } from './components/puzzle-thumbnail/puzzle-thumbnail.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CarouselItemDirective } from './common/carousel/carousel-item.directive';
import { CarouselItemElement, CarouselComponent } from './common/carousel/carousel.component';
import { ImageItemElement } from './admin_module/components/puzzles/create-edit-puzzle.component';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    UsersModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    FlexLayoutModule,
    FormsModule,
    ],
  declarations: [
      AppComponent,
      NavigationComponent,
      ProductsListComponent,
      PuzzleThumbnailComponent,
      ProductDetailsComponent,
      
      CarouselComponent, 
      CarouselItemDirective, 
      CarouselItemElement,

      ImageItemElement
    ],
  providers: [
    DatePipe,
    PuzzleLookupService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
