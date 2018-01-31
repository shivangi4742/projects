import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import {CreatepaymentlinkComponent} from "./createpaymentlink/createpaymentlink.component";
import {PaymentlistComponent} from "./paymentlist/paymentlist.component";
import {SucesspaymentlinkComponent} from "./sucesspaymentlink/sucesspaymentlink.component";

const routes: Routes = [
    { path: 'successpaylink', component: SucesspaymentlinkComponent },
    { path: 'createpaylink', component: CreatepaymentlinkComponent },
    { path: 'paymentlist', component: PaymentlistComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
