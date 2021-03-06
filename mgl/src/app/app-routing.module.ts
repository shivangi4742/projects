import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CustomerComponent } from './customer/customer.component';
import { CustomerpaymentComponent } from './customerpayment/customerpayment.component';

import { FailuremglComponent } from './failuremgl/failuremgl.component';
import { SuccessmglComponent } from './successmgl/successmgl.component';
import { MglpaymentComponent } from './mglpayment/mglpayment.component';
import { SuccesstestComponent } from './successtest/successtest.component';

const routes: Routes = [
     { path: 'customer', component: CustomerComponent }, 
     { path: 'customerpayment', component: CustomerpaymentComponent },
     { path: 'mglpayment',  component: MglpaymentComponent },
     { path: 'mglfailure',  component: FailuremglComponent },
     { path: 'mglsuccess',  component: SuccessmglComponent },
     { path: 'successtest',  component: SuccesstestComponent },
     { path: 'mglpay/mglsuccess',  component: SuccessmglComponent },
     { path: 'mglpay/mglfailure',  component: FailuremglComponent },
     { path: '**', redirectTo: '/customer', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }