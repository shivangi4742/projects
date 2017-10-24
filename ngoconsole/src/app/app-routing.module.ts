import { NgModule } from '@angular/core';
import { RouterModule, Routes }   from '@angular/router';

import { NotificationComponent } from 'benowcomponents';

import { OrdersComponent } from './orders/orders.component';
import { CampaignComponent } from './campaign/campaign.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewcampaignComponent } from './newcampaign/newcampaign.component';
import { SharecampaignComponent } from './sharecampaign/sharecampaign.component';

const routes: Routes = [
    { path: 'campaign', component: CampaignComponent },
    { path: 'sharecampaign/:id', component: SharecampaignComponent },
    { path: 'newcampaign', component: CampaignComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'console', component: OrdersComponent },
    { path: 'notification/:page/:id', component: NotificationComponent },
    { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }