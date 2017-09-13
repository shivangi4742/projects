import { NgModule } from '@angular/core';
import { RouterModule, Routes }   from '@angular/router';

import { NotificationComponent } from 'benowcomponents';

import { PgComponent } from './pg/pg.component';
import { BuyComponent } from './buy/buy.component';
import { PayComponent } from './pay/pay.component';
import { NotfoundComponent } from './notfound/notfound.component';

const routes: Routes = [
    { path: 'notfound', component: NotfoundComponent },
    { path: 'pg/:id', component: PgComponent },
    { path: 'pay/:id', component: PayComponent },
    { path: 'buy/:id/:code', component: BuyComponent },
    { path: 'notification/:page/:id', component: NotificationComponent },
    { path: '**', redirectTo: '/notfound', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }