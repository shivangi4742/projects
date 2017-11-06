import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { SDKService } from './services/sdk.service';
import { HelpService } from './services/help.service';
import { FileService } from './services/file.service';
import { UserService } from './services/user.service';
import { UtilsService } from './services/utils.service';
import { ProductService } from './services/product.service';
import { CampaignService } from './services/campaign.service';
import { TransactionService } from './services/transaction.service';
import { NotificationService } from './services/notification.service';

import { ObjectFilterPipe } from './pipes/objectfilter.pipe';

export { PG } from './models/pg.model';
export { SDK } from './models/sdk.model';
export { User } from './models/user.model';
export { Status } from './models/status.model';
export { Product } from './models/product.model';
export { Campaign } from './models/campaign.model';
export { PayRequest } from './models/payrequest.model';
export { Attachment } from './models/attachment.model';
export { Transaction } from './models/transaction.model';
export { Notification } from './models/notification.model';
export { CampaignSummary } from './models/campaignsummary.model';

export { SDKService } from './services/sdk.service';
export { HelpService } from './services/help.service';
export { FileService } from './services/file.service';
export { UserService } from './services/user.service';
export { UtilsService } from './services/utils.service';
export { ProductService } from './services/product.service';
export { CampaignService } from './services/campaign.service';
export { TransactionService } from './services/transaction.service';
export { NotificationService } from './services/notification.service';

export { ObjectFilterPipe } from './pipes/objectfilter.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ ObjectFilterPipe ],
  exports: [ ObjectFilterPipe ]
})
export class SharedServicesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedServicesModule,
      providers: [
        SDKService,
        HelpService,
        FileService,
        UserService,
        UtilsService,
        ProductService,
        CampaignService,
        TransactionService,
        NotificationService
      ]
    };
  }
}
