import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PrepageComponent } from "./prepage/prepage.component";

const routes: Routes = [
    { path: 'pay-zipgrid', component: PrepageComponent },
    { path: 'pay-zipgrid/:id', component: PrepageComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }