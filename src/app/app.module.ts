import {BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {TranslateModule} from '@ngx-translate/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {DataTablesModule} from 'angular-datatables';

import {AdminModule} from './components/admin/admin.module';
import {reducers} from './store/app.states';
import {AuthGuard} from './helpers/auth.guard';

import {AppComponent} from './app.component';
import {LoginComponent} from './components/login/login.component';
import {AuthService} from './services/auth.service';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {AuthEffects} from './store/effects/auth.effects';
import {UserEffects} from './store/effects/user.effects';
import {JwtInterceptor} from './helpers/jwt.interceptors';
import {ErrorInterceptor} from './helpers/error.interceptor';
import {MyGeneralModule} from './components/general/my-general.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    TranslateModule.forRoot(),
    AppRoutingModule,
    AdminModule,
    FormsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    ReactiveFormsModule,
    StoreModule.forRoot(reducers, {}),
    EffectsModule.forRoot([AuthEffects, UserEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 5
    }),
    EffectsModule,
    DataTablesModule,
    MyGeneralModule,
    BrowserAnimationsModule,

  ],
  providers: [
    AuthService,
    AuthGuard,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
