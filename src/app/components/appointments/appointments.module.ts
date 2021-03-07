import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DataTablesModule} from 'angular-datatables';
import {MyGeneralModule} from '../general/my-general.module';
import {AppointmentsRoutingModule} from './appointments-routing.module';

@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    AppointmentsRoutingModule,
    NgbModule,
    TranslateModule,
    ReactiveFormsModule,
    DataTablesModule,
    MyGeneralModule,
    FormsModule
  ]
})
export class AppointmentsModule { }
