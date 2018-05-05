import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PgComponent } from './pg/pg.component';
import { CartComponent } from './cart/cart.component';
import { StoreComponent } from './store/store.component';
import { ProductComponent } from './product/product.component';
import { BuyerinfoComponent } from './buyerinfo/buyerinfo.component';
import { PaymentmodeComponent } from './paymentmode/paymentmode.component';
import { PaymentsuccessComponent } from './paymentsuccess/paymentsuccess.component';
import { PaymentfailureComponent } from './paymentfailure/paymentfailure.component';
import { ReoprterrorComponent } from './reoprterror/reoprterror.component';
import { DashComponent } from './dash/dash.component';
import { NotfoundComponent } from './notfound/notfound.component';
const routes: Routes = [
    { path: ':code/dash', component: DashComponent },
    { path: 'pay', component: StoreComponent },
  
    { path: 'store', component: StoreComponent },
    { path: 'payerinfo', component: BuyerinfoComponent },
    { path: 'paymentmode', component: PaymentmodeComponent },
    { path: 'pg', component: PgComponent },
    { path: 'paid/:id', component: PaymentsuccessComponent },
    { path: 'unpaid/:id', component: PaymentfailureComponent },
    { path: ':amount', component: StoreComponent },
    { path: 'pay/:amount', component: StoreComponent },
    { path: ':code/cart', component: CartComponent },
    { path: ':code/buyerinfo', component: BuyerinfoComponent }, 
    { path: ':code/paymentmode', component: PaymentmodeComponent }, 
    { path: ':code/store', component: StoreComponent }, 
    { path: ':code/product/:id', component: ProductComponent },
    { path: ':code/product2/:id', component: ProductComponent },
    { path: ':code/paymentsuccess/:id', component: PaymentsuccessComponent },
    { path: ':code/paymentfailure/:id', component: PaymentfailureComponent },
    { path: ':code/pg/:id/:cf', component: PgComponent },
    { path: ':code/reporterror', component: ReoprterrorComponent },
    { path: 'notfound', component: NotfoundComponent },
     { path: '**', redirectTo: '1/store', pathMatch: 'full' }//TODO: Not found
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }