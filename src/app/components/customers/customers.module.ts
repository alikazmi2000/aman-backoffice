import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DataTablesModule} from 'angular-datatables';
import {MyGeneralModule} from '../general/my-general.module';

import { CustomersRoutingModule } from './customers-routing.module';
import { DetailComponent } from './detail/detail.component';
import { FormComponent } from './form/form.component';
import { ListComponent } from './list/list.component';

@NgModule({
  declarations: [DetailComponent, FormComponent, ListComponent],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    NgbModule,
    TranslateModule,
    ReactiveFormsModule,
    DataTablesModule,
    MyGeneralModule,
    FormsModule
  ]
})
export class CustomersModule { }
