import { NgModule } from '@angular/core';
import { RouterModule, Routes }   from '@angular/router';

import { NotificationComponent } from 'benowcomponents';

import { DashboardComponent } from './dashboard/dashboard.component';
import { NewcampaignComponent } from './newcampaign/newcampaign.component';

const routes: Routes = [
    { path: 'newcampaign', component: NewcampaignComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'notification/:page/:id', component: NotificationComponent },
    { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }