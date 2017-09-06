import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { UserService } from './services/user.service';
import { UtilsService } from './services/utils.service';
import { CampaignService } from './services/campaign.service';

export { User } from './models/user.model';
export { Campaign } from './models/campaign.model';
export { CampaignSummary } from './models/campaignsummary.model';

export { UserService } from './services/user.service';
export { UtilsService } from './services/utils.service';
export { CampaignService } from './services/campaign.service';

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
        UtilsService,
        CampaignService
      ]
    };
  }
}
