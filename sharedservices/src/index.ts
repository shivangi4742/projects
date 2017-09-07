import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { UserService } from './services/user.service';
import { UtilsService } from './services/utils.service';
import { CampaignService } from './services/campaign.service';
import { NotificationService } from './services/notification.service';

export { User } from './models/user.model';
export { Campaign } from './models/campaign.model';
export { Attachment } from './models/attachment.model';
export { Notification } from './models/notification.model';
export { CampaignSummary } from './models/campaignsummary.model';

export { UserService } from './services/user.service';
export { UtilsService } from './services/utils.service';
export { CampaignService } from './services/campaign.service';
export { NotificationService } from './services/notification.service';

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
        CampaignService,
        NotificationService
      ]
    };
  }
}
