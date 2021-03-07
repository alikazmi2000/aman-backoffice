import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ListComponent} from './list/list.component';
import {UsersRoutingModule} from './users-routing.module';
import {EditComponent} from './edit/edit.component';
import {DetailComponent} from './detail/detail.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DataTablesModule} from 'angular-datatables';
import {MyGeneralModule} from '../general/my-general.module';
import {AngularMultiSelectModule} from 'angular2-multiselect-dropdown';

@NgModule({
  declarations: [
    ListComponent,
    EditComponent,
    DetailComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    NgbModule,
    TranslateModule,
    ReactiveFormsModule,
    DataTablesModule,
    MyGeneralModule,
    FormsModule,
    AngularMultiSelectModule
  ]
})
export class UsersModule {
}
