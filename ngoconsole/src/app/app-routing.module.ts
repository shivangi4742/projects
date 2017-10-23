import { NgModule } from '@angular/core';
import { RouterModule, Routes }   from '@angular/router';

import { NotificationComponent } from 'benowcomponents';

import { OrdersComponent } from './orders/orders.component';
import { CampaignComponent } from './campaign/campaign.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewcampaignComponent } from './newcampaign/newcampaign.component';

const routes: Routes = [
    { path: 'campaign', component: CampaignComponent },
    { path: 'newcampaign', component: NewcampaignComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'console', component: OrdersComponent },
    { path: 'notification/:page/:id', component: NotificationComponent },
    { path: '**', redirectTo: '/campaign', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }