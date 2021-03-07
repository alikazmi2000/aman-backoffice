import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CategoriesRoutingModule} from './categories-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DataTablesModule} from 'angular-datatables';
import {MyGeneralModule} from '../general/my-general.module';
import {EditComponent} from './edit/edit.component';
import {ListComponent} from './list/list.component';
import { RemoveHostDirective } from './remove-host.directive';
@NgModule({
  declarations: [
    EditComponent,
    ListComponent,
    RemoveHostDirective
  ],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    NgbModule,
    TranslateModule,
    ReactiveFormsModule,
    DataTablesModule,
    MyGeneralModule,
    FormsModule
  ]
})
export class CategoriesModule { }
