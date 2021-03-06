import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { RouterModule }   from '@angular/router';
import { HttpModule, Http } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { MaterializeModule } from 'angular2-materialize';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';

import { SharedServicesModule } from 'benowservices';
import { SharedComponentsModule } from 'benowcomponents'; 

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { CustomerComponent } from './customer/customer.component';
import { CustomerpaymentComponent } from './customerpayment/customerpayment.component';

import { MglService } from  './services/mgl.service';
import { PayrequestService } from './services/payrequestservice.service';

import { SuccessmglComponent } from './successmgl/successmgl.component';
import { FailuremglComponent } from './failuremgl/failuremgl.component';
import { MglpaymentComponent } from './mglpayment/mglpayment.component';
import { SuccesstestComponent } from './successtest/successtest.component';
import { MgltopnavComponent } from './mgltopnav/mgltopnav.component';
import { BhimupiinfoComponent } from './bhimupiinfo/bhimupiinfo.component';


export function HttpFactory(http: Http) {
  return new TranslateStaticLoader(http, '/assets/mgl/i18n', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    CustomerComponent,
    CustomerpaymentComponent,
    SuccessmglComponent,
    FailuremglComponent,
    MglpaymentComponent,
    SuccesstestComponent,
    MgltopnavComponent,
    BhimupiinfoComponent 

  ],
  imports: [
    HttpModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    MaterializeModule,
    SharedComponentsModule, 
    SharedServicesModule.forRoot(),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: HttpFactory,
      deps: [Http]
    })
  ],
  providers: [MglService, PayrequestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
