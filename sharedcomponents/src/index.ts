import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslateModule } from 'ng2-translate';
import { MaterializeModule } from "angular2-materialize";

import { SharedServicesModule } from 'benowservices';

import { TopnavComponent } from './topnav.component';
import { FooterbarComponent } from './footerbar.component';
import { UserTopNavComponent } from './usertopnav.component';

export { TopnavComponent } from './topnav.component';
export { FooterbarComponent } from './footerbar.component';
export { UserTopNavComponent } from './usertopnav.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MaterializeModule,
    SharedServicesModule
  ],
  declarations: [
    TopnavComponent,
    FooterbarComponent,
    UserTopNavComponent    
  ],
  exports: [
    TopnavComponent,
    FooterbarComponent,
    UserTopNavComponent
  ]
})
export class SharedComponentsModule { }