import { NgModule } from '@angular/core';
import { RouterModule, Routes }   from '@angular/router';

import { NotificationComponent } from 'benowcomponents';

import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'notification/:page/:id', component: NotificationComponent },
    { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }