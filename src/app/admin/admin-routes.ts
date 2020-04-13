import { Routes } from '@angular/router';
import { ManufacturersComponent } from './components/manufacturers/manufacturers.component';
import { CreateEditManufacturerComponent } from './components/manufacturers/create-edit-manufacturer.component';

export const adminRoutes: Routes = [
    { path: '', children: [
        {
            path: '', children: [
                { path: 'manufacturers', component: ManufacturersComponent},
                { path: 'manufacturers/add', component: CreateEditManufacturerComponent }
            ]
        }
    ] }
];