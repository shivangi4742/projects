import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StoreComponent } from './store/store.component';
import { ProductComponent } from './product/product.component';
import { BuyerinfoComponent } from './buyerinfo/buyerinfo.component';
import { PaymentmodeComponent } from './paymentmode/paymentmode.component';

const routes: Routes = [
    { path: 'buyerinfo', component: BuyerinfoComponent }, 
    { path: 'paymentmode', component: PaymentmodeComponent }, 
    { path: 'store/:code', component: StoreComponent }, 
    { path: 'product/:id', component: ProductComponent },
    { path: '**', redirectTo: '/store/1', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }