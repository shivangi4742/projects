import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotificationComponent } from 'benowcomponents';

import { PgComponent } from './pg/pg.component';
import { BuyComponent } from './buy/buy.component';
import { PayComponent } from './pay/pay.component';
import { SuccessComponent } from './success/success.component';
import { FailureComponent } from './failure/failure.component';
import { NotfoundComponent } from './notfound/notfound.component';

const routes: Routes = [
    { path: 'notfound', component: NotfoundComponent },
    { path: 'pg/:id', component: PgComponent },
    { path: 'pay/:id/:prods', component: PayComponent },
    { path: 'pay/:id', component: PayComponent },
    { path: 'pay/:id/:prods/:sdkId', component: PayComponent }, // FOR SDK
    { path: 'buy/:id/:code', component: BuyComponent },
    { path: 'paymentsuccess/:id/:txnid', component: SuccessComponent },
    { path: 'paymentfailure/:id/:txnid', component: FailureComponent },
    { path: 'donate/:id/:prods/:fund', component: PayComponent },
    { path: 'donate/:id/:prods', component: PayComponent },
    { path: 'donate/:id', component: PayComponent },
    { path: 'donate/:id/:prods/:fund/:amount', component: PayComponent },
    { path: 'contribute/:id/:code', component: BuyComponent },
    { path: 'donationsuccess/:id/:txnid/:fund', component: SuccessComponent },
    { path: 'donationsuccess/:id/:txnid', component: SuccessComponent },
    { path: 'donationfailure/:id/:txnid', component: FailureComponent },
    { path: 'notification/:page/:id', component: NotificationComponent },
    { path: '**', redirectTo: '/notfound', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
