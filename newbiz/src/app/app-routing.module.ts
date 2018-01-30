import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import {CreatepaymentlinkComponent} from "./createpaymentlink/createpaymentlink.component";

const routes: Routes = [
    { path: 'createpaylink', component: CreatepaymentlinkComponent},
    { path: 'dashboard', component: DashboardComponent },
    { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
