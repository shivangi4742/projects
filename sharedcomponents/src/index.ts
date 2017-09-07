import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { TranslateModule } from 'ng2-translate';
import { MaterializeModule } from "angular2-materialize";

import { SharedServicesModule } from 'benowservices';

import { TopnavComponent } from './topnav.component';
import { FooterbarComponent } from './footerbar.component';
import { UserTopNavComponent } from './usertopnav.component';
import { NotificationsComponent } from './notifications.component';

export { TopnavComponent } from './topnav.component';
export { FooterbarComponent } from './footerbar.component';
export { UserTopNavComponent } from './usertopnav.component';
export { NotificationsComponent } from './notifications.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    BrowserModule,
    TranslateModule,
    MaterializeModule,
    SharedServicesModule
  ],
  declarations: [
    TopnavComponent,
    FooterbarComponent,
    UserTopNavComponent,
    NotificationsComponent    
  ],
  exports: [
    TopnavComponent,
    FooterbarComponent,
    UserTopNavComponent,
    NotificationsComponent
  ]
})
export class SharedComponentsModule { }