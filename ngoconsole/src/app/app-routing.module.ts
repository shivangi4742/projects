import { NgModule } from '@angular/core';
import { RouterModule, Routes }   from '@angular/router';

import { NotificationComponent } from 'benowcomponents';

import { CatalogComponent } from './catalog/catalog.component';
import { CampaignComponent } from './campaign/campaign.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharecampaignComponent } from './sharecampaign/sharecampaign.component';

const routes: Routes = [
    { path: 'catalog', component: CatalogComponent },
    { path: 'campaign', component: CampaignComponent },
    { path: 'sharecampaign/:id', component: SharecampaignComponent },
    { path: 'newcampaign', component: CampaignComponent },
    { path: 'newcampaign/:txnRef', component: CampaignComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'notification/:page/:id', component: NotificationComponent },
    { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
