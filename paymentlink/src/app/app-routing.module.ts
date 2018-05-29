import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotificationComponent } from 'benowcomponents';

import { PgComponent } from './pg/pg.component';
import { BuyComponent } from './buy/buy.component';
import { PayComponent } from './pay/pay.component';
import { SuccessComponent } from './success/success.component';
import { FailureComponent } from './failure/failure.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { RazorpayComponent } from './razorpay/razorpay.component';
import { PaytmrequestComponent } from "./paytmrequest/paytmrequest.component";
import { PaytmresponseComponent } from "./paytmresponse/paytmresponse.component";
import { SodexoresponseComponent } from './sodexoresponse/sodexoresponse.component';

const routes: Routes = [
    { path: 'notfound', component: NotfoundComponent },
    { path: 'pg/:id', component: PgComponent },
    { path: 'pg/:id/:prods', component: PgComponent },
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
    { path: 'razorpay/:id', component: RazorpayComponent },
    { path: 'razorpay/:id/:prods/:txnid/:amount/:fund', component: RazorpayComponent },
    { path: 'razorpay/:id/:prods/:txnid/:amount', component: RazorpayComponent },
    { path: 'razorpay/:id/:prods/:txnid', component: RazorpayComponent },
    { path: 'paytmrequest', component: PaytmrequestComponent },
    { path: 'paytmrequest/:id', component: PaytmrequestComponent },
    { path: 'paytmresponse', component: PaytmresponseComponent },
    { path: 'paytmresponse/:id/:txnid', component: SuccessComponent },
    { path: 'sodexosuccess/:code/:mobile/:id/:txnid', component: SuccessComponent },
    { path: 'sodexosuccess/:code/:mobile', component: SodexoresponseComponent },
    { path: 'sodexofailure/code/:mobile/:id/:txnid', component: FailureComponent }, 
    { path: 'sodexofailure/:code/:mobile', component: SodexoresponseComponent },
    { path: 'sodexoresponse', component: SodexoresponseComponent },
    { path: 'paysdk', component: PayComponent },
    { path: '**', redirectTo: '/notfound', pathMatch: 'full' }
];  

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
