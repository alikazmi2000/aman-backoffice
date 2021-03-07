import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {ListComponent} from './list/list.component';
import { DetailComponent } from './detail/detail.component';
//import {EditComponent} from './edit/edit.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {path: 'list', component: ListComponent},
      {path: 'detail/:id', component: DetailComponent},
      //{path: 'add', component: EditComponent},
      //{path: 'edit/:id', component: EditComponent}
    ]
  },

  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: '**', redirectTo: 'list', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactRoutingModule { }
