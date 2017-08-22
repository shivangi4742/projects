import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { UserService } from './services/user.service';
import { UtilsService } from './services/utils.service';

export { User } from './models/usermodel';
export { UserService } from './services/user.service';
export { UtilsService } from './services/utils.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ ],
  exports: [ ]
})
export class SharedServicesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedServicesModule,
      providers: [
        UserService,
        UtilsService
      ]
    };
  }
}
