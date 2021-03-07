
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OrderRoutingModule} from './order-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DataTablesModule} from 'angular-datatables';
import {MyGeneralModule} from '../general/my-general.module';
import {ListComponent} from './list/list.component';
import { DetailComponent } from './detail/detail.component';
@NgModule({
  declarations: [ListComponent,DetailComponent],
  imports: [
    CommonModule,
    OrderRoutingModule,
    NgbModule,
    TranslateModule,
    ReactiveFormsModule,
    DataTablesModule,
    MyGeneralModule,
    FormsModule
  ]
})
export class OrderModule { }
