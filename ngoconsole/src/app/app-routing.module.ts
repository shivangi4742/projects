import { NgModule } from '@angular/core';
import { RouterModule, Routes }   from '@angular/router';

import { NotificationComponent } from 'benowcomponents';

import { CatalogComponent } from './catalog/catalog.component';
import { CampaignComponent } from './campaign/campaign.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharecampaignComponent } from './sharecampaign/sharecampaign.component';
import { CustomerlistComponent } from "./customerlist/customerlist.component";

const routes: Routes = [
    { path: 'catalog', component: CatalogComponent },
    { path: 'campaign', component: CampaignComponent },
    { path: 'campaign/:select', component: CampaignComponent },
    { path: 'campaign/:select/:data', component: CampaignComponent },
    { path: 'sharecampaign/:id', component: SharecampaignComponent },
    { path: 'sharecampaign/:id/:url', component: SharecampaignComponent },
    { path: 'campaignbtn', component: CampaignComponent },
    { path: 'newcampaign', component: CampaignComponent },
    { path: 'newcampaign/:select', component: CampaignComponent },
    { path: 'newcampaign/:select/:data', component: CampaignComponent },
    { path: 'campaignbtn/:select', component: CampaignComponent },
    { path: 'campaignbtn/:select/:data', component: CampaignComponent },
    { path: 'donationoptions', component: CatalogComponent },
    { path: 'estall', component: CampaignComponent },
    { path: 'estall/:select', component: CampaignComponent },
    { path: 'estall/:select/:data', component: CampaignComponent },
    { path: 'shareestall/:id', component: SharecampaignComponent },
    { path: 'shareestall/:id/:url', component: SharecampaignComponent },
    { path: 'newestall', component: CampaignComponent },
    { path: 'newestall/:select', component: CampaignComponent },
    { path: 'newestall/:select/:data', component: CampaignComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'donors', component: CustomerlistComponent },
    { path: 'notification/:page/:id', component: NotificationComponent },
    { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
