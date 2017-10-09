import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CustomerComponent } from './customer/customer.component';
import { CustomerpaymentComponent } from './customerpayment/customerpayment.component';
import { BenowpaymentComponent }  from './benowpayment/benowpayment.component';
import { FailuremglComponent } from './failuremgl/failuremgl.component';
import { SuccessmglComponent } from './successmgl/successmgl.component';


const routes: Routes = [
     { path: 'customer', component: CustomerComponent }, 
     { path: 'customerpayment', component: CustomerpaymentComponent },
     { path: 'mglpayment',  component: BenowpaymentComponent },
     { path: 'mglfailure',  component: FailuremglComponent },
     { path: 'mglsuccess',  component: SuccessmglComponent },
     { path: '**', redirectTo: '/customer', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }