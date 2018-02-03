import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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
  paymentlink: PaymentLinks[];
  constructor(private translate: TranslateService, private fileService: FileService, private utilsService: UtilsService,
    private userService: UserService, private productService: ProductService, private campaignService: CampaignService, private router: Router,
    private route: ActivatedRoute, private sdkService: SDKService, private helpService: HelpService) { }

  ngOnInit() {
    this.campaignService.merchantpaymentlink('AA3O1')
        .then(paymentlink => this.paymentlink = paymentlink);
  }
  setActiveTab(t: number) {
    console.log(t);
    this.active = t;
  }
  getStatus(): Status {
    return this.utilsService.getStatus();
  }




}