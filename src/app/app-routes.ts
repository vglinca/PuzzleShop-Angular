import { Routes } from '@angular/router';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { NotFoundPageComponent } from './common/not_found_page/not-found-page.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { CartComponent } from './components/cart/cart.component';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { StripePaymentComponent } from './components/stripe-payment/stripe-payment.component';
import { ConfirmOrderComponent } from './components/confirm-order/confirm-order.component';

export const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'collections/:puzzleType', component: ProductsListComponent },
    { path: 'collections/:puzzleType/:id', component: ProductDetailsComponent },
    { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
    { path: 'checkout', component: ConfirmOrderComponent},
    { path: 'payment', component: StripePaymentComponent },
    { path: 'administration', loadChildren: () => import('./admin_module/admin.module').then(a => a.AdminModule), canActivate: [AdminAuthGuard]},
    { path: '', redirectTo: 'home', pathMatch: 'full'},
    { path: '**', component: NotFoundPageComponent }
];