import { Routes } from '@angular/router';
import { ProductsListComponent } from './components/products-list/products-list.component';

export const appRoutes: Routes = [
    { path: 'rubics-cubes/:puzzleType', component: ProductsListComponent },
    { path: 'wca-puzzles', component: ProductsListComponent},
    { path: 'administration', loadChildren: () => import('./admin_module/admin.module').then(a => a.AdminModule)},
    { path: 'user', loadChildren: () => import('./users_module/users.module').then(u => u.UsersModule) }
];