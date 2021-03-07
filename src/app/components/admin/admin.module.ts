import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminRoutingModule} from './admin-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';
import {NavbarComponent} from '../partials/navbar/navbar.component';
import {SidebarComponent} from '../partials/sidebar/sidebar.component';
import {FooterComponent} from '../partials/footer/footer.component';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {AdminComponent} from './admin.component';
import {UsersModule} from '../users/users.module';
import {ServiceProviderModule} from '../service-provider/service-provider.module';
import {ProfileComponent} from '../profile/profile.component';
import {MyGeneralModule} from '../general/my-general.module';
import {TranslateModule} from '@ngx-translate/core';
import { SettingComponent } from '../setting/setting.component';

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    ProfileComponent,
    SettingComponent
  ],
  exports: [
    NavbarComponent,
    SidebarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    UsersModule,
    ServiceProviderModule,
    NgbModule.forRoot(),
    MyGeneralModule,
    ReactiveFormsModule,
    TranslateModule,
    ChartsModule
  ]
})
export class AdminModule {
}
