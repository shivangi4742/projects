import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { MaterializeAction } from 'angular2-materialize';

import { SDK,Businesspro, CampaignService, UserService, User, UtilsService, LocationService } from 'benowservices';

@Component({
  selector: 'app-sucesspaymentlink',
  templateUrl: './sucesspaymentlink.component.html',
  styleUrls: ['./sucesspaymentlink.component.css']
})
export class SucesspaymentlinkComponent implements OnInit {
  businesspro:Businesspro;
  createPaymentLink: string = '/createpaylink';
  paymentList: string = '/paymentlist';
  dashboard: string = '/dashboard';
  txnId: string;
  url: string;
  isCopied1: boolean = false;
  user: User;
  sending: boolean = false;
  emailsend: boolean = false;
  email: string;
  mobileNumber: string;
  cc: string;
  text: string;
  subject: string;
  mtype: number = 1;
  whatsAppLink: string;
  emailSuccess: boolean = false;
  smsSuccess: boolean = false;
  modalActions: any = new EventEmitter<string|MaterializeAction>();
  modalActions1: any = new EventEmitter<string|MaterializeAction>();

  constructor(private locationService: LocationService, private route: ActivatedRoute, private userService: UserService, private utilsService: UtilsService,
              private campaignService: CampaignService) { }

  ngOnInit() {
    this.locationService.setLocation('successpaylink');
    this.txnId = this.route.snapshot.params['id'];
   

    this.userService.getUser()
      .then(res => this.init(res));
  }

  init(res){
    this.user = res;

    if(this.utilsService.isNGO(this.user.mccCode, this.user.lob)){
      this.mtype = 2;
    }

    if(this.utilsService.isHB(this.user.merchantCode, this.user.lob)){
      this.mtype = 3;
    }
    this.userService.checkMerchant(this.user.mobileNumber, 'b')
    .then(bres => this.initshare(bres));

   
    this.whatsAppLink = 'whatsapp://send?text='+this.url;
  }

  initshare(res: any) {
    this.businesspro = res;
    this.initstart();
  }

  initstart(){
     if(this.businesspro.storeUrl) {
       this.url = 'https://' + this.businesspro.storeUrl + ".benow.in/paymentlink/" + this.txnId;
     } else {
       this.url = 'https://merchant.benow.in/buy/' + this.user.merchantCode + '/paymentlink/' + this.txnId;
  }
}
  sent(res: any) {
    this.sending = false;
    if (res === true)
      this.smsSuccess = true;
    else {
      if (this.utilsService.getUnregistered())
        this.utilsService.setStatus(true, false, 'Complete your registration to save and share Payment Link');
      else
        this.utilsService.setStatus(true, false, this.utilsService.returnGenericError().errMsg);
    }
  }

  sms() {
    this.smsSuccess = false;
    this.modalActions.emit({ action: "modal", params: ['open'] });
  }

  smssave(){
    this.sending = true;
    this.utilsService.setStatus(false, false, '');

    this.campaignService.smsCampaignLink(this.url, this.mtype, this.user.displayName, 'Payment Link', this.mobileNumber)
      .then(res => this.sent(res));
  }

  cancel() {
    this.modalActions.emit({ action: "modal", params: ['close'] });
  }

  cancel1(){
    this.modalActions1.emit({ action: "modal", params: ['close'] });
  }
  emailm() {
    this.emailSuccess = false;
    this.modalActions1.emit({ action: "modal", params: ['open'] });
  }

  emaiil() {
    let slt: string = 'Customer';
    let pslt: string = 'pay';
    if (this.mtype == 2) {
      slt = 'Donor';
      pslt = 'contribute';
    }

    this.emailsend = true;
    this.text = "Dear " + slt + ", To " + pslt + ' to ' + this.user.displayName + ", please click on " + this.url;
    this.cc = "";

    this.subject = 'Pay to '+this.user.displayName;
    this.utilsService.setStatus(false, false, '');
    this.campaignService.sendEmail(this.email, this.text, this.subject, this.cc)
      .then(res => this.emailsent(res));
  }

  emailsent(res: any) {
    this.emailsend = false;
    if (res === true)
      this.emailSuccess = true;
    else {
      if (this.utilsService.getUnregistered())
        this.utilsService.setStatus(true, false, 'Complete your registration to save and share Payment Link');
      else
        this.utilsService.setStatus(true, false, this.utilsService.returnGenericError().errMsg);
    }
  }

}
