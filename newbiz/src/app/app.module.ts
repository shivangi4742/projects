import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { RouterModule }   from '@angular/router';
import { HttpModule, Http } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { MaterializeModule } from 'angular2-materialize';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { ClipboardModule } from 'ngx-clipboard';

import { SharedServicesModule } from 'benowservices';
import { SharedComponentsModule } from 'benowcomponents';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BiztopnavComponent } from './biztopnav/biztopnav.component';
import { BizfooterbarComponent } from './bizfooterbar/bizfooterbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PaymentlistComponent } from './paymentlist/paymentlist.component';
import { LeftnavComponent } from './leftnav/leftnav.component';
import { RightnavComponent } from './rightnav/rightnav.component';
import { CreatepaymentlinkComponent } from './createpaymentlink/createpaymentlink.component';
import { SucesspaymentlinkComponent } from './sucesspaymentlink/sucesspaymentlink.component';
import { SettingsComponent } from './settings/settings.component';
import { TransactionhistoryComponent } from './transactionhistory/transactionhistory.component';

export function HttpFactory(http: Http) {
  return new TranslateStaticLoader(http, '/assets/newbiz/i18n', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    BiztopnavComponent,
    BizfooterbarComponent,
    DashboardComponent,
    PaymentlistComponent,
LeftnavComponent,
    RightnavComponent,
    CreatepaymentlinkComponent,
    SucesspaymentlinkComponent,
    SettingsComponent,
    TransactionhistoryComponent
  ],
  imports: [
    HttpModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    MaterializeModule,
    SharedComponentsModule,
    ClipboardModule,
    SharedServicesModule.forRoot(),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: HttpFactory,
      deps: [Http]
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
