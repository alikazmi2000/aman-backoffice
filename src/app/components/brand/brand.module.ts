
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BrandRoutingModule} from './brand-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DataTablesModule} from 'angular-datatables';
import {MyGeneralModule} from '../general/my-general.module';
import {ListComponent} from './list/list.component';
import {EditComponent} from './edit/edit.component';
import { FileUploadModule } from 'ng2-file-upload';
import * as cloudinary from 'cloudinary-core';
import {CloudinaryModule, CloudinaryConfiguration, provideCloudinary} from '@cloudinary/angular-5.x';


@NgModule({
  declarations: [ListComponent,EditComponent,],
  imports: [
    CommonModule,
    BrandRoutingModule,
    NgbModule,
    TranslateModule,
    ReactiveFormsModule,
    DataTablesModule,
    MyGeneralModule,
    FormsModule,
    FileUploadModule,
    CloudinaryModule.forRoot(cloudinary, {
      cloud_name: 'dzkkrbic8',
      upload_preset: 'ezobn6fx'
    }),
  ]
})
export class BrandModule { }
