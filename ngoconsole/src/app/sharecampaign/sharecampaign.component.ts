import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { TranslateService } from 'ng2-translate';
import { MaterializeAction } from 'angular2-materialize';


import { CampaignService, UserService, UtilsService, SDK, User, ProductService, Product } from 'benowservices';

@Component({
  selector: 'sharecampaign',
  templateUrl: './sharecampaign.component.html',
  styleUrls: ['./sharecampaign.component.css']
})
export class SharecampaignComponent implements OnInit {
  id: string;
  isCopied1: boolean = false;
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
  emailsend: boolean = false;
  isMobile: boolean = false;
  hasProducts: boolean = false;
  mtype: number = 2;
  campaignLink: string = '/newcampaign';
  email: string;
  cc: string;
  fblink: string;

  text: string;
  subject: string;
  modalActions: any = new EventEmitter<string|MaterializeAction>();
  modalActions1: any = new EventEmitter<string|MaterializeAction>();
  constructor(private campaignService: CampaignService, private route: ActivatedRoute, private router: Router, private userService: UserService,
    private utilsService: UtilsService, private productService: ProductService) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    let url: string = this.route.snapshot.params['url'];
    if(url)
      this.savedURL = JSON.parse(atob(url)).url;

    this.utilsService.setStatus(false, false, '');
    this.userService.getUser()
      .then(res => this.initUser(res));
  }

  initCampaign(cmp: SDK) {
    this.sdk = cmp;
    if (this.sdk && this.sdk.id) {
      this.productService.getProductsForCampaign(this.user.merchantCode, this.sdk.id)
        .then(res => this.fillProds(res));
      this.campaignURL = this.sdk.id;
      this.campaignURLPrefix = this.utilsService.getRedirectURL() + this.user.merchantCode + '/';
      if (this.sdk.id && this.sdk.id.length > 4)
        this.campaignURL = this.sdk.id.substring(2, 5) + this.sdk.id.substring(this.sdk.id.length - 3);

      if(this.sdk.isButton) {
        let b: string = 'buy';
        if(this.sdk.mtype == 2)
          b = 'contribute';

        this.savedURL = this.utilsService.getBaseURL() + 'ppl/' + b + '/' + this.sdk.id + '/' + this.sdk.merchantCode;
      }
    }
  }

  fillProds(res: Array<Product>) {
    this.sdk.products = res;
    if (this.sdk.products && this.sdk.products.length > 0)
      this.hasProducts = true;

    this.loaded = true;
  }

  initUser(res: User) {
    if (this.id && res) {
      this.user = res;
      this.isMobile = this.utilsService.isAnyMobile();
      if (this.utilsService.isHB(this.user.merchantCode, this.user.lob)) {
        this.mtype = 3;
        this.campaignLink = '/newestall';
      }

      this.campaignService.getCampaign(this.id, this.mtype)
        .then(cmp => this.initCampaign(cmp));
    }
    else
      window.location.href = this.utilsService.getLogoutPageURL();
  }

  saveURL() {
    if (this.campaignURL && this.campaignURL.trim()) {
      this.saving = true;
      this.utilsService.setStatus(false, false, '');
      this.campaignService.saveCampaignLink(false, this.hasProducts, this.user.merchantCode, this.sdk.id, this.campaignURL, this.sdk.title,
        this.sdk.description, this.sdk.imageURL, this.sdk.expiryDate, this.sdk.mtype)
        .then(res => this.saved(res));
    }
  }

  saved(res: any) {
    this.saving = false;
    window.scrollTo(0, 0);
    if (res && res.success == true) {
      this.utilsService.setStatus(false, true, 'Successfully saved payment link');
      this.savedURL = this.campaignURLPrefix + this.campaignURL;
    }
    else if (res.errorCode === 'URL_IN_USE')
      this.utilsService.setStatus(true, false, 'This URL is already in use. Please choose a different URL');
    else {
      if (this.utilsService.getUnregistered())
        this.utilsService.setStatus(true, false, 'Complete your registration to save and share campaign URL');
      else
        this.utilsService.setStatus(true, false, this.utilsService.returnGenericError().errMsg);
    }
  }

  sent(res: any) {
    this.sending = false;
    if (res === true)
      this.utilsService.setStatus(false, true, 'Successfully sent campaign link in SMS');
    else {
      if (this.utilsService.getUnregistered())
        this.utilsService.setStatus(true, false, 'Complete your registration to save and share campaign URL');
      else
        this.utilsService.setStatus(true, false, this.utilsService.returnGenericError().errMsg);
    }
  }

  sms() {
    this.modalActions.emit({ action: "modal", params: ['open'] });
  }
  smssave(){
    this.sending = true;
    this.utilsService.setStatus(false, false, '');
    this.campaignService.smsCampaignLink(this.savedURL, this.mtype, this.user.displayName, this.sdk.title, this.mobileNumber)
      .then(res => this.sent(res));
  }

  cancel() {
    this.modalActions.emit({ action: "modal", params: ['close'] });    
  }

  goToDashboard() {
    window.location.href = this.utilsService.getOldDashboardURL();
  }
  
cancel1(){
   this.modalActions1.emit({ action: "modal", params: ['close'] });
}  
  emailm() {
    this.modalActions1.emit({ action: "modal", params: ['open'] });
  }

  emaiil() {
    let slt: string = 'Customer';
    let pslt: string = 'pay';
    if (this.sdk.merchantType == 2) {
      slt = 'Donor';
      pslt = 'contribute';
    }

    this.emailsend = true;
    this.text = "Dear " + slt + ", To " + pslt + ' to ' + this.user.displayName + ", please click on " + this.savedURL;
    this.cc = "";

    this.subject = this.sdk.title;
    this.utilsService.setStatus(false, false, '');
    this.campaignService.sendEmail(this.email, this.text, this.subject, this.cc)
      .then(res => this.emailsent(res));
  }

  emailsent(res: any) {
    this.emailsend = false;
    if (res === true)
      this.utilsService.setStatus(false, true, 'Successfully sent campaign link in email');
    else {
      if (this.utilsService.getUnregistered())
        this.utilsService.setStatus(true, false, 'Complete your registration to save and share campaign URL');
      else
        this.utilsService.setStatus(true, false, this.utilsService.returnGenericError().errMsg);
    }
  }

  copy() {
    var copyText = document.getElementById("name");
    var aa = (copyText as any).value;

    aa.onclick = function () {
      document.execCommand("copy");
    }

    aa.addEventListener("copy", function (event) {
      event.preventDefault();
      if (event.clipboardData) {
        event.clipboardData.setData("text/plain", aa.textContent);
      }
    });
  }

  fbClick() {
    window.open('https://www.facebook.com/sharer/sharer.php?kid_directed_site=0&u=' + 
    this.savedURL + '&display=popup&ref=plugin&src=share_button', '',
     'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
    return false;
  }

  edit() {
    if(this.sdk.isButton)
      this.router.navigateByUrl('/campaignbtn/edit/' + btoa(JSON.stringify({url: this.savedURL, id: this.id})));
    else
      this.router.navigateByUrl('/newcampaign/edit/' + btoa(JSON.stringify({url: this.savedURL, id: this.id})));
  }

  twitterbutton() {
    window.open('https://twitter.com/share?url=' + this.savedURL,'', 
    'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
    return false;
  }

  
}
