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

    { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
