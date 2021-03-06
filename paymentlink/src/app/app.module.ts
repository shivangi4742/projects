import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule, Http } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { MaterializeModule } from 'angular2-materialize';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';

import { SharedServicesModule } from 'benowservices';
import { SharedComponentsModule } from 'benowcomponents';
import { WindowRef } from "./windowref.service";

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BuyComponent } from './buy/buy.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { PayComponent } from './pay/pay.component';
import { PgComponent } from './pg/pg.component';
import { SuccessComponent } from './success/success.component';
import { FailureComponent } from './failure/failure.component';
import { RazorpayComponent } from './razorpay/razorpay.component';
import { PaytmrequestComponent } from './paytmrequest/paytmrequest.component';
import { PaytmresponseComponent } from './paytmresponse/paytmresponse.component';
import { SodexoresponseComponent } from './sodexoresponse/sodexoresponse.component';

export function HttpFactory(http: Http) {
  return new TranslateStaticLoader(http, '/assets/paymentlink/i18n', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    BuyComponent,
    NotfoundComponent,
    PayComponent,
    PgComponent,
    SuccessComponent,
    FailureComponent,
    RazorpayComponent,
    PaytmrequestComponent,
    PaytmresponseComponent,
    SodexoresponseComponent
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
  providers: [WindowRef],
  bootstrap: [AppComponent]
})
export class AppModule { }
