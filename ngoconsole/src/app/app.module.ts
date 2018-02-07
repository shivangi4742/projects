import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { MaterializeModule } from 'angular2-materialize';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';

import { SharedServicesModule } from 'benowservices';
import { SharedComponentsModule } from 'benowcomponents';
import { ClipboardModule } from 'ngx-clipboard';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SelectproductsComponent } from './selectproducts/selectproducts.component';
import { CampaignComponent } from './campaign/campaign.component';
import { SharecampaignComponent } from './sharecampaign/sharecampaign.component';
import { CatalogComponent } from './catalog/catalog.component';
import { AddproductComponent } from './addproduct/addproduct.component';
import { ProductlineComponent } from './productline/productline.component';
import { CustomerlistComponent } from './customerlist/customerlist.component';
import { ImageCropperModule } from 'ng2-img-cropper';

export function HttpFactory(http: Http) {
  return new TranslateStaticLoader(http, '/assets/ngoconsole/i18n', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SelectproductsComponent,
    CampaignComponent,
    SharecampaignComponent,
    CatalogComponent,
    AddproductComponent,
    ProductlineComponent,
    CustomerlistComponent
  ],
  imports: [
    HttpModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    MaterializeModule,
    SharedComponentsModule,
    ImageCropperModule,
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
