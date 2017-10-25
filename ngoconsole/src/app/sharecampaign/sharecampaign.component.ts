import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { TranslateService } from 'ng2-translate';

import { CampaignService, UserService, UtilsService, SDK, User, ProductService, Product } from 'benowservices';

@Component({
  selector: 'sharecampaign',
  templateUrl: './sharecampaign.component.html',
  styleUrls: ['./sharecampaign.component.css']
})
export class SharecampaignComponent implements OnInit {
  id: string;
  savedURL: string;
  campaignURL: string;
  mobileNumber: string;
  savedCampaignURL: string;
  campaignURLPrefix: string;
  sdk: SDK;
  user: User;
  loaded: boolean = false;
  saving: boolean = false;
  sending: boolean = false;
  hasProducts: boolean = false;
  mtype: number = 2;

  constructor(private campaignService: CampaignService, private route: ActivatedRoute, private router: Router, private userService: UserService,
    private utilsService: UtilsService, private productService: ProductService) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.utilsService.setStatus(false, false, '');
    this.userService.getUser()
      .then(res => this.initUser(res));    
  }

  initCampaign(cmp: SDK) {
    this.sdk = cmp;
    if(this.sdk && this.sdk.id) {
      this.productService.getProductsForCampaign(this.user.merchantCode, this.sdk.id)
        .then(res => this.fillProds(res));
      this.campaignURL = this.sdk.id;
      this.campaignURLPrefix = this.utilsService.getRedirectURL() + this.user.merchantCode + '/';
      if(this.sdk.id && this.sdk.id.length > 4)
        this.campaignURL = this.sdk.id.substring(2, 5) + this.sdk.id.substring(this.sdk.id.length - 3);
    }
  }

  fillProds(res: Array<Product>) {
    this.sdk.products = res;
    if(this.sdk.products && this.sdk.products.length > 0)
      this.hasProducts = true;

    this.loaded = true;
  }

  initUser(res: User) {
    if(this.id && res) {
      this.user = res;
      if(this.utilsService.isHB(this.user.merchantCode))
        this.mtype = 3;
      
      this.campaignService.getCampaign(this.id, this.mtype)
        .then(cmp => this.initCampaign(cmp));
    }
    else
      window.location.href = this.utilsService.getLogoutPageURL();      
  }

  saveURL() {
    if(this.campaignURL && this.campaignURL.trim()) {
      this.saving = true;
      this.utilsService.setStatus(false, false, '');
      this.campaignService.saveCampaignLink(false, this.hasProducts, this.user.merchantCode, this.sdk.id, this.campaignURL, this.sdk.title, 
        this.sdk.description, this.sdk.imageURL)
        .then(res => this.saved(res));
    }
  }

  saved(res: any) {
    this.saving = false;
    if(res && res.success == true) {
      this.utilsService.setStatus(false, true, 'Successfully saved payment link');
      this.savedURL = this.campaignURLPrefix + this.campaignURL;
    }
    else if(res.errorCode === 'URL_IN_USE')
      this.utilsService.setStatus(true, false, 'This URL is already in use. Please choose a different URL');
    else
      this.utilsService.setStatus(true, false, this.utilsService.returnGenericError().errMsg);
  }

  sent(res: any) {
    this.sending = false;
    if(res === true)
      this.utilsService.setStatus(false, true, 'Successfully sent campaign link in SMS');    
    else
      this.utilsService.setStatus(true, false, this.utilsService.returnGenericError().errMsg);    
  }

  sms() {
    this.sending = true;
    this.utilsService.setStatus(false, false, '');
    this.campaignService.smsCampaignLink(this.savedURL, this.mtype, this.user.displayName, this.sdk.title, this.mobileNumber)
      .then(res => this.sent(res));
  }
}