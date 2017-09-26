import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CustomerComponent } from './customer/customer.component';

const routes: Routes = [
     { path: 'customer', component: CustomerComponent }, 
    { path: '**', redirectTo: '/customer', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }