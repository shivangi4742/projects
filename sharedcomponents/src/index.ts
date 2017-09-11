import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule }   from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import { TranslateModule } from 'ng2-translate';
import { MaterializeModule } from "angular2-materialize";

import { SharedServicesModule } from 'benowservices';

import { TopnavComponent } from './topnav.component';
import { StatusComponent } from './status.component';
import { FooterbarComponent } from './footerbar.component';
import { UserTopNavComponent } from './usertopnav.component';
import { NotificationComponent } from './notification.component';
import { NotificationsComponent } from './notifications.component';
import { ProductWidgetComponent } from './productwidget.component';

export { TopnavComponent } from './topnav.component';
export { StatusComponent } from './status.component';
export { FooterbarComponent } from './footerbar.component';
export { UserTopNavComponent } from './usertopnav.component';
export { NotificationComponent } from './notification.component';
export { NotificationsComponent } from './notifications.component';
export { ProductWidgetComponent } from './productwidget.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    BrowserModule,
    TranslateModule,
    MaterializeModule,
    SharedServicesModule
  ],
  declarations: [
    TopnavComponent,
    StatusComponent,
    FooterbarComponent,
    UserTopNavComponent,
    NotificationComponent,
    NotificationsComponent,
    ProductWidgetComponent    
  ],
  exports: [
    TopnavComponent,
    StatusComponent,
    FooterbarComponent,
    UserTopNavComponent,
    NotificationComponent,
    NotificationsComponent,
    ProductWidgetComponent
  ]
})
export class SharedComponentsModule { }