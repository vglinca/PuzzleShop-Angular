import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { NavigationComponent } from './navigation/navigation.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app-routes';
import { UsersModule } from './users/users.module';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { PuzzleLookupService } from './services/puzzle-lookup-service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { PuzzleThumbnailComponent } from './products-list/puzzle-thumbnail.component';
import { InsteadOfEmptyStringPipe } from './common/instead-of-empty-string.pipe';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    UsersModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    FlexLayoutModule,
    FormsModule
    ],
  declarations: [
      AppComponent,
      NavigationComponent,
      ProductsListComponent,
      PuzzleThumbnailComponent,
      InsteadOfEmptyStringPipe
    ],
  providers: [
    DatePipe,
    PuzzleLookupService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
