
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, EventEmitter } from '@angular/core';

import { MaterializeAction } from 'angular2-materialize';

import { FileService, UtilsService, User, PaymentLinks, UserService,
   Product, ProductService, CampaignService, SDKService, Status, HelpService, 
   Campaign, CampaignList, SDK } from 'benowservices';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-paymentlist',
  templateUrl: './paymentlist.component.html',
  styleUrls: ['./paymentlist.component.css']
})
export class PaymentlistComponent implements OnInit {
  active: number = 0;
  isInitial: boolean = true;
  isCopied1: boolean = false;
  paymentlink: PaymentLinks[];
   user:User;
   modalActions: any = new EventEmitter<string|MaterializeAction>();
  constructor(private translate: TranslateService, private fileService: FileService, private utilsService: UtilsService,
    private userService: UserService, private productService: ProductService, private campaignService: CampaignService, private router: Router,
    private route: ActivatedRoute, private sdkService: SDKService, private helpService: HelpService) { }

  ngOnInit() {
     this.utilsService.setStatus(false, false, '');
    this.userService.getUser()
      .then(res => this.init(res));
    
  }
   init(usr: User) {
    if (usr && usr.id) {
      this.user = usr;
     this.campaignService.merchantpaymentlink(this.user.merchantCode)
        .then(res => this.initdtail(res));
    }

  }
  setActiveTab(t: number) {
    this.active = t;
  }
  getStatus(): Status {
    return this.utilsService.getStatus();
  }

  initdtail(paymentlink:PaymentLinks[]){
    this.paymentlink = paymentlink;
    
  }




}
