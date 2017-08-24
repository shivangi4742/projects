import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { RouterModule }   from '@angular/router';
import { HttpModule, Http } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { MaterializeModule } from 'angular2-materialize';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';

import { SharedServicesModule } from 'benowservices';
import { SharedComponentsModule } from 'benowcomponents'; 

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SupportComponent } from './support/support.component';
import { EmailedComponent } from './emailed/emailed.component';
import { LoginformComponent } from './loginform/loginform.component';
import { VerifyformComponent } from './verifyform/verifyform.component';
import { ProceedtillComponent } from './proceedtill/proceedtill.component';
import { PasswordchangedComponent } from './passwordchanged/passwordchanged.component';
import { ChangepasswordformComponent } from './changepasswordform/changepasswordform.component';

export function HttpFactory(http: Http) {
  return new TranslateStaticLoader(http, '/assets/login/i18n', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SupportComponent,
    LoginformComponent,
    ProceedtillComponent,
    VerifyformComponent,
    EmailedComponent,
    ChangepasswordformComponent,
    PasswordchangedComponent
  ],
  imports: [
    HttpModule,
    FormsModule,
    BrowserModule,
    MaterializeModule,
    SharedComponentsModule, 
    SharedServicesModule.forRoot(),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: HttpFactory,
      deps: [Http]
    }), 
    RouterModule.forRoot([      
      {
        path: 'logout',
        component: LoginComponent
      },
      {
        path: 'logout/:status',
        component: LoginComponent
      },
      {
        path: 'login/:status',
        component: LoginComponent
      },
      {
        path: 'pwdchanged/:status',
        component: LoginComponent
      },
      {
        path: 'changepwd/:status',
        component: LoginComponent
      },
      {
        path: 'emailed/:status',
        component: LoginComponent
      },
      {
        path: 'verify/:status',
        component: LoginComponent
      },
      {
        path: '**', 
        redirectTo: '/login/1', 
        pathMatch: 'full' 
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
