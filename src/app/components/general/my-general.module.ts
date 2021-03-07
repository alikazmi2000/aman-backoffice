import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BreadcrumbComponent} from './breadcrumb/breadcrumb.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import {ConfirmDialogService} from './confirmation-dialog/confirm-dialog.service';
import { PageHeaderComponent } from './page-header/page-header.component';
import { StatusBadgeComponent } from './status-badge/status-badge.component';
import {RouterModule} from '@angular/router';
import { AlertComponent } from './alert/alert.component';
import { CategoryListComponent} from './category-list/category-list.component';
import { CategoryCheckBoxListComponent } from './category-checkbox-list/category-checkbox-list.component';
import { UserComponent } from './user/user.component';
import { DatetimeComponent } from './datetime/datetime.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { DaterangeComponent } from './daterange/daterange.component';
import { RemoveHostDirective } from './remove-host.directive';

@NgModule({
  declarations: [
    BreadcrumbComponent,
    ConfirmationDialogComponent,
    PageHeaderComponent,
    StatusBadgeComponent,
    AlertComponent,
    UserComponent,
    DatetimeComponent,
    DaterangeComponent,
    CategoryListComponent,
    CategoryCheckBoxListComponent,
    RemoveHostDirective
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule
  ],
  exports: [
    BreadcrumbComponent,
    PageHeaderComponent,
    StatusBadgeComponent,
    AlertComponent,
    UserComponent,
    DatetimeComponent,
    DaterangeComponent,
    CategoryListComponent,
    CategoryCheckBoxListComponent
  ],
  providers: [
    ConfirmDialogService
  ],
  entryComponents: [ ConfirmationDialogComponent, PageHeaderComponent ]
})
export class MyGeneralModule { }
