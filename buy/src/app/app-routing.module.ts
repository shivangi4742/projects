import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CartComponent } from './cart/cart.component';
import { StoreComponent } from './store/store.component';
import { ProductComponent } from './product/product.component';
import { BuyerinfoComponent } from './buyerinfo/buyerinfo.component';
import { PaymentmodeComponent } from './paymentmode/paymentmode.component';
import { PaymentsuccessComponent } from './paymentsuccess/paymentsuccess.component';

const routes: Routes = [
    { path: ':code/cart', component: CartComponent },
    { path: ':code/buyerinfo', component: BuyerinfoComponent }, 
    { path: ':code/paymentmode', component: PaymentmodeComponent }, 
    { path: ':code/store', component: StoreComponent }, 
    { path: ':code/product/:id', component: ProductComponent },
    { path: ':code/product2/:id', component: ProductComponent },
    { path: ':code/paymentsuccess/:id', component: PaymentsuccessComponent },
    { path: '**', redirectTo: '1/store', pathMatch: 'full' }//TODO: Not found
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }