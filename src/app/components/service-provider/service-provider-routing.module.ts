import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { FormComponent } from './form/form.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {path: 'list', component: ListComponent},
      {path: 'add', component: FormComponent},
      {path: 'edit/:id', component: FormComponent},
      {path: 'detail/:id', component: DetailComponent}
    ]
  },

  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: '**', redirectTo: 'list', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceProviderRoutingModule { }
