import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslateModule } from 'ng2-translate';

import { SharedServicesModule } from 'benowservices';

import { TopnavComponent } from './topnav.component';
import { FooterbarComponent } from './footerbar.component';

export { TopnavComponent } from './topnav.component';
export { FooterbarComponent } from './footerbar.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SharedServicesModule
  ],
  declarations: [
    TopnavComponent,
    FooterbarComponent    
  ],
  exports: [
    TopnavComponent,
    FooterbarComponent
  ]
})
export class SharedComponentsModule { }