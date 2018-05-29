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
import { BuytopnavComponent } from './buytopnav/buytopnav.component';
import { BuyfooterbarComponent } from './buyfooterbar/buyfooterbar.component';
import { StoreComponent } from './store/store.component';
import { LeftnavComponent } from './leftnav/leftnav.component';
import { BuyerinfoComponent } from './buyerinfo/buyerinfo.component';
import { PaymentmodeComponent } from './paymentmode/paymentmode.component';
import { ProductComponent } from './product/product.component';
import { ProdwidgetComponent } from './prodwidget/prodwidget.component';
import { CartComponent } from './cart/cart.component';
import { PaymentsuccessComponent } from './paymentsuccess/paymentsuccess.component';
import { PgComponent } from './pg/pg.component';
import { PaymentfailureComponent } from './paymentfailure/paymentfailure.component';
import { ReoprterrorComponent } from './reoprterror/reoprterror.component';
import { DashComponent } from './dash/dash.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { CategoryupdateComponent } from './categoryupdate/categoryupdate.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { MobilenoComponent } from './mobileno/mobileno.component';

export function HttpFactory(http: Http) {
  return new TranslateStaticLoader(http, '/assets/buy/i18n', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    BuytopnavComponent,
    BuyfooterbarComponent,
    StoreComponent,
    LeftnavComponent,
    BuyerinfoComponent,
    PaymentmodeComponent,
    ProductComponent,
    ProdwidgetComponent,
    CartComponent,
    PaymentsuccessComponent,
    PgComponent,
    PaymentfailureComponent,
    ReoprterrorComponent,
    DashComponent,
    NotfoundComponent,
    CategoryupdateComponent,
    ThankyouComponent,
    MobilenoComponent
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
