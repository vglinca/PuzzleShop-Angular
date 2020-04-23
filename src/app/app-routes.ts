import { Routes } from '@angular/router';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { NotFoundPageComponent } from './common/not_found_page/not-found-page.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';

export const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'collections/:puzzleType', component: ProductsListComponent },
    { path: 'collections/:puzzleType/:id', component: ProductDetailsComponent },
    { path: 'administration', loadChildren: () => import('./admin_module/admin.module').then(a => a.AdminModule), canActivate: [AuthGuard]},
    { path: '', redirectTo: 'home', pathMatch: 'full'},
    { path: '**', component: NotFoundPageComponent }
];