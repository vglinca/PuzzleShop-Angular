import { Routes } from '@angular/router';
import { ProductsListComponent } from './products-list/products-list.component';

export const appRoutes: Routes = [
    { path: 'rubics-cubes/:puzzleType', component: ProductsListComponent },
    { path: 'wca-puzzles', component: ProductsListComponent},
    { path: 'administration', loadChildren: () => import('./admin/admin.module').then(a => a.AdminModule)},
    { path: 'user', loadChildren: () => import('./users/users.module').then(u => u.UsersModule) }
];