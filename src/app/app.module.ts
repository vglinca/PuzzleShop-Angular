import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material_module/material.module';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app-routes';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { PuzzleLookupService } from './services/lookup.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ImageItemElement } from './admin_module/components/puzzles/create-edit/create-edit-puzzle.component';
import { UserRegistrationComponent } from './components/account/registration/user-registration.component';
import { UserLoginComponent } from './components/account/auth/user-login.component';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { ConfirmDialogComponent } from './common/confirm_dialog/confirm-dialog.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { AddToCartDialogComponent } from './components/add-to-cart-dialog/add-to-cart-dialog.component';
import { CartComponent } from './components/cart/cart.component';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { StripePaymentComponent } from './components/stripe-payment/stripe-payment.component';
import { ConfirmOrderComponent } from './components/confirm-order/confirm-order.component';
import { MatSelectCountryModule } from '@angular-material-extensions/select-country';
import { StylePaginatorDirective } from './common/style-paginator.directive';
import { GalleryModule } from  '@ngx-gallery/core';
import { StarRatingComponent } from './common/star-rating/star-rating.component';
import { PersonalCabinetComponent } from './components/personal-cabinet/personal-cabinet.component';
import { PersonalInfoComponent } from './components/personal-cabinet/personal-info/personal-info.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    ProductsListComponent,
    ProductDetailsComponent,
    
    ImageItemElement,

    UserRegistrationComponent,
    UserLoginComponent,
    HomeComponent,
    AddToCartDialogComponent,
    CartComponent,
    StripePaymentComponent,
    ConfirmOrderComponent,
    StylePaginatorDirective,
    StarRatingComponent,
    PersonalCabinetComponent,
    PersonalInfoComponent,

    NotFoundPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    GalleryModule,
    MatSelectCountryModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem(environment.accessToken),
        whitelistedDomains: [environment.whitelistedDomains],
        blacklistedRoutes: [environment.blacklistedRoutes]
      }})
    ],
  providers: [
    DatePipe,
    PuzzleLookupService,
    AuthGuard,
    AdminAuthGuard
  ],
  entryComponents: [
    UserRegistrationComponent,
    UserLoginComponent,
    ConfirmDialogComponent,
    AddToCartDialogComponent,
    ConfirmOrderComponent,
    StripePaymentComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
