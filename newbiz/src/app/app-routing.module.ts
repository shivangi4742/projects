import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { CreatepaymentlinkComponent } from "./createpaymentlink/createpaymentlink.component";
import { PaymentlistComponent } from "./paymentlist/paymentlist.component";
import { SucesspaymentlinkComponent } from "./sucesspaymentlink/sucesspaymentlink.component";
import { TransactionhistoryComponent } from "./transactionhistory/transactionhistory.component";
import { SettingsComponent } from "./settings/settings.component";
import { RegisterComponent } from "./register/register.component";
import { ThanksregisterComponent } from "./thanksregister/thanksregister.component";
import { KycregComponent } from "./kycreg/kycreg.component";
import { KycthanksComponent } from "./kycthanks/kycthanks.component";
import { ProductcatalogComponent } from "./productcatalog/productcatalog.component";
import { AddproductComponent } from './addproduct/addproduct.component';
import { ChangepassComponent } from './changepass/changepass.component';
import { CreatecampaignComponent } from './createcampaign/createcampaign.component';
import { AddproducttocampaignComponent } from './addproducttocampaign/addproducttocampaign.component';
import { CreatecampaignurlComponent } from './createcampaignurl/createcampaignurl.component';
import { EditproductComponent } from "./editproduct/editproduct.component";


const routes: Routes = [
    { path: 'transactionhistory', component: TransactionhistoryComponent },
    { path: 'successpaylink/:id', component: SucesspaymentlinkComponent },
    { path: 'createpaylink', component: CreatepaymentlinkComponent },
    { path: 'paymentlist', component: PaymentlistComponent },
    { path: 'thankskycprocess', component: KycthanksComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'settings/:open', component: SettingsComponent },
    { path: 'registrationprocess', component: RegisterComponent },
    { path: 'kycprocess', component: KycregComponent },
    { path: 'thanksregistrationprocess', component: ThanksregisterComponent },
    { path: 'catalogue', component: ProductcatalogComponent },
    { path: 'addproduct', component: AddproductComponent },
    { path: 'editproduct/:id', component: EditproductComponent },
    { path: 'changepassword', component: ChangepassComponent},
    { path: 'createcampaign', component: CreatecampaignComponent},
    { path: 'addproducttocampaign', component: AddproducttocampaignComponent },
    { path: 'createcampaignurl', component: CreatecampaignurlComponent },


    { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
