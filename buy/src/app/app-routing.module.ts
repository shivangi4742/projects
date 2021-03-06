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
import { ThankyouComponent } from './thankyou/thankyou.component';
import { MobilenoComponent } from './mobileno/mobileno.component';

const routes: Routes = [
    { path: ':code/homepage', component: DashComponent },
    { path: 'thankyou', component: ThankyouComponent},
    { path: 'categoryupdate', component: MobilenoComponent},
    { path: '', component: DashComponent },
    { path: 'homepage', component: DashComponent },
    { path: 'pay', component: StoreComponent },
    { path: 'store', component: StoreComponent },
    { path: 'payerinfo', component: BuyerinfoComponent },
    { path: 'paymentmode', component: PaymentmodeComponent },
    { path: 'pg', component: PgComponent },
    { path: 'paid/:id', component: PaymentsuccessComponent },
    { path: 'unpaid/:id', component: PaymentfailureComponent },
    { path: ':amount', component: StoreComponent },
    { path: ':code/pay/:amount', component: StoreComponent },
    { path: 'paymentlink/:id', component: StoreComponent },
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
     { path: '**', redirectTo: 'homepage', pathMatch: 'full' }//TODO: Not found
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }