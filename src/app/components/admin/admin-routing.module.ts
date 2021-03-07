import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {DashboardComponent} from '../dashboard/dashboard.component';
import {AdminComponent} from './admin.component';
import {AuthGuard} from '../../helpers/auth.guard';
import {ProfileComponent} from '../profile/profile.component';
import {SettingComponent} from '../setting/setting.component';


const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {path: 'dashboard', component: DashboardComponent},
      {path: 'profile', component: ProfileComponent},
      {path: 'settings', component: SettingComponent},
      {path: 'service', loadChildren: () => import('src/app/components/service-provider/service-provider.module').then(m => m.ServiceProviderModule)},

      {path: 'service-provider', loadChildren: () => import('src/app/components/users/users.module').then(m => m.UsersModule)},
      {path: 'regions', loadChildren: () => import('src/app/components/regions/regions.module').then(m => m.RegionsModule)},
      {path: 'categories', loadChildren: () => import('src/app/components/categories/categories.module').then(m => m.CategoriesModule)},
      {path: 'products', loadChildren: () => import('src/app/components/products/products.module').then(m => m.ProductsModule)},
      {path: 'order', loadChildren: () => import('src/app/components/order/order.module').then(m => m.OrderModule)},
      {path: 'contact', loadChildren: () => import('src/app/components/contact/contact.module').then(m => m.ContactModule)},
      {path: 'customer', loadChildren: () => import('src/app/components/customers/customers.module').then(m => m.CustomersModule)},

      {path: 'brand', loadChildren: () => import('src/app/components/brand/brand.module').then(m => m.BrandModule)},

      {path: 'projects', loadChildren: () => import('src/app/components/projects/projects.module').then(m => m.ProjectsModule)},
      // tslint:disable-next-line:max-line-length
      {path: 'appointments', loadChildren: () => import('src/app/components/appointments/appointments.module').then(m => m.AppointmentsModule)},
      // tslint:disable-next-line:max-line-length
      {path: 'transactions', loadChildren: () => import('src/app/components/transactions/transactions.module').then(m => m.TransactionsModule)},

      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
