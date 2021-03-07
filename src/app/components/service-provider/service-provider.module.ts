import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ServiceProviderRoutingModule } from './service-provider-routing.module';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { FormComponent } from './form/form.component';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DataTablesModule} from 'angular-datatables';
import {MyGeneralModule} from '../general/my-general.module';
import {AngularMultiSelectModule} from 'angular2-multiselect-dropdown';




@NgModule({
  declarations: [
    ListComponent,
    FormComponent,
    DetailComponent
  ],
  imports: [
    CommonModule,
    ServiceProviderRoutingModule,
    NgbModule,
    TranslateModule,
    ReactiveFormsModule,
    DataTablesModule,
    MyGeneralModule,
    FormsModule,
    AngularMultiSelectModule
  ]
})
export class ServiceProviderModule { }
