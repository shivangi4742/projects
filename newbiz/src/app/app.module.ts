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
import { SocketService } from './socket.service';
import { RegisterComponent } from './register/register.component';
import { ThanksregisterComponent } from './thanksregister/thanksregister.component';
import { KycregComponent } from './kycreg/kycreg.component';
import { KycthanksComponent } from './kycthanks/kycthanks.component';
import { ProductcatalogComponent } from './productcatalog/productcatalog.component';
import { AddproductComponent } from './addproduct/addproduct.component';
import { ChangepassComponent } from './changepass/changepass.component';
import { CreatecampaignComponent } from './createcampaign/createcampaign.component';
import { AddproducttocampaignComponent } from './addproducttocampaign/addproducttocampaign.component';
import { CreatecampaignurlComponent } from './createcampaignurl/createcampaignurl.component';

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
    TransactionhistoryComponent,
    RegisterComponent,
    ThanksregisterComponent,
    KycregComponent,
    KycthanksComponent,
    ProductcatalogComponent,
    AddproductComponent,
    ChangepassComponent,
    CreatecampaignComponent,
    AddproducttocampaignComponent,
    CreatecampaignurlComponent
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
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
