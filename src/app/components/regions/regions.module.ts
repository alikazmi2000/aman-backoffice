import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import {RegionsRoutingModule} from './regions-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DataTablesModule} from 'angular-datatables';
import {MyGeneralModule} from '../general/my-general.module';
import {AngularMultiSelectModule} from 'angular2-multiselect-dropdown';

@NgModule({
  declarations: [
    EditComponent,
    ListComponent,
    DetailComponent
  ],
  imports: [
    CommonModule,
    RegionsRoutingModule,
    NgbModule,
    TranslateModule,
    ReactiveFormsModule,
    DataTablesModule,
    MyGeneralModule,
    AngularMultiSelectModule,
    FormsModule
  ]
})
export class RegionsModule { }
