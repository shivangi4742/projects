import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { TranslateService } from 'ng2-translate';
import { UtilsService, User, UserService, Status, Accountpro, Businesspro, Merchant } from 'benowservices';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  accountpro: Accountpro;
  formLoaded: boolean = false;
  businesspro: Businesspro;
  chargeFee: boolean = false;
  user: User;
  conaccountnumber: string;
  gstno: string;
  isBusExpanded: boolean = false;
  isPanExpanded: boolean = false;
  isAcctExpanded: boolean = false;
  isNgoExpanded: boolean = false;
  isPaymentExpanded: boolean = false;
  isgstExpanded: boolean = false;
  ispan1Expanded: boolean = false;
  gst: boolean = false;
  errgstvalidate: boolean = false;
  errorgst: string;
  errpancard: boolean = false;
  errorpanmsg: string;
  errvalidate: boolean = false;
  errorifsc: string;
  errpincodevalidate: boolean = false;
  errorpincode: string;
  erraddressvalidate: boolean = false;
  erroraddres: string;
  errbusinessvalidate: boolean = false;
  errorbusiness: string;
  errdisplayvalidate: boolean = false;
  errordisplay: string;
  err: boolean = false;
  errmsg: string;
  editt: boolean = true;


  constructor(private translate: TranslateService, private utilsService: UtilsService,
    private userService: UserService) { }

  ngOnInit() {
    this.utilsService.setStatus(false, false, '');
    this.userService.getUser()
      .then(res => this.init(res));
  }
  init(usr: User) {
    if (usr && usr.id) {
      this.user = usr;
      this.translate.use(this.utilsService.getLanguageCode(this.user.language));

      this.userService.getfetchMerchantForEditDetails(this.user.email, this.user.id)
        .then(res => this.initDetails(res));


      this.loadForm();
    }

  }
  initDetails(res: any) {
    //console.log(res);
  }

  loadForm() {
    this.userService.checkMerchant(this.user.mobileNumber, "a")
      .then(ares => this.initcheckacc(ares));

    this.userService.checkMerchant(this.user.mobileNumber, "b")
      .then(mres => this.businesspro = mres);

    this.userService.getMerchantDetails(this.user.merchantCode)
      .then(res => this.bind(res));

    this.formLoaded = true;
  }

  bind(res: any) {
    if (res && res.id) {
      this.chargeFee = res.chargeConvenienceFee;
    }
  }
  initcheckacc(res:any){
     this.accountpro = res;
     if(this.accountpro.accountRefNumber) {
       this.conaccountnumber = this.accountpro.accountRefNumber;
     }
   
  }


  paymentdetail() {
    window.scrollTo(0, 0);
    this.isPaymentExpanded = !this.isPaymentExpanded;
    document.getElementById('paybn').click();
  }

  paymentdetail1() {
    this.isPaymentExpanded = !this.isPaymentExpanded;
    this.isBusExpanded = false;
    this.isAcctExpanded = false;
    this.isPanExpanded = false;
    this.ispan1Expanded = false;
    this.isNgoExpanded = false;
  }

  personaldetail() {
    window.scrollTo(0, 0);
    this.ispan1Expanded = !this.ispan1Expanded;
    document.getElementById('personalbn').click();
  }

  personaldetail1() {
    this.ispan1Expanded = !this.ispan1Expanded;
    this.isPaymentExpanded = false;
    this.isBusExpanded = false;
    this.isAcctExpanded = false;
    this.isPanExpanded = false;
    this.isNgoExpanded = false;
  }

  accountdetail() {
    window.scrollTo(0, 0);
    this.isBusExpanded = !this.isBusExpanded;
    document.getElementById('acbn').click();
  }

  accountdetail1() {
    this.isBusExpanded = !this.isBusExpanded;
    this.isAcctExpanded = false;
    this.isPanExpanded = false;
    this.isNgoExpanded = false;
    this.isPaymentExpanded = false;
    this.ispan1Expanded = false;
  }

  bankdetails() {
    window.scrollTo(0, 0);
    this.isPanExpanded = !this.isPanExpanded;
    document.getElementById('acbns').click();
  }

  bankdetail11() {
    this.isPanExpanded = !this.isPanExpanded;
    this.isAcctExpanded = false;
    this.isBusExpanded = false;
    this.isNgoExpanded = false;
    this.isPaymentExpanded = false;
    this.ispan1Expanded = false;
  }
  accountdetails() {
    window.scrollTo(0, 0);
    this.isAcctExpanded = !this.isAcctExpanded;
    document.getElementById('acounr').click();
  }

  accountdetail11() {
    this.isAcctExpanded = !this.isAcctExpanded;
    this.isPanExpanded = false;
    this.isBusExpanded = false;
    this.isNgoExpanded = false;
    this.isPaymentExpanded = false;
    this.ispan1Expanded = false;
  }
  bankdetail() {
    window.scrollTo(0, 0);
    this.isNgoExpanded = !this.isNgoExpanded;
    document.getElementById('bnkset').click();
  }

  bankdetail1() {
    this.isNgoExpanded = !this.isNgoExpanded;
    this.isAcctExpanded = false;
    this.isBusExpanded = false;
    this.isPanExpanded = false;
    this.isPaymentExpanded = false;
    this.ispan1Expanded = false;
  }
  gstdetail() {
    window.scrollTo(0, 0);
    this.isgstExpanded = !this.isgstExpanded;
    document.getElementById('gstbn').click();
  }

  gstdetail1() {
    this.isgstExpanded = !this.isgstExpanded;
    this.isNgoExpanded = false;
    this.isAcctExpanded = false;
    this.isBusExpanded = false;
    this.isPanExpanded = false;
    this.isPaymentExpanded = false;
    this.ispan1Expanded = false;
  }
  allgstFields() {
    if (this.gst) {
      if (this.businesspro.gstno) {
        return true;
      }
      return false;
    }
    return true;
  }

  setount(res: boolean) {
    this.gst = res;

  }
  save() {
    this.userService.registerSelfMerchant(this.user.id, this.businesspro.businessName,
      this.businesspro.contactEmailId, this.businesspro.category, this.businesspro.subCategory, this.businesspro.city,
      this.businesspro.locality, this.businesspro.contactPerson, this.businesspro.address,
      this.businesspro.contactEmailId, this.businesspro.businessTypeCode, this.businesspro.businessType,
      this.businesspro.pincode, this.businesspro.gstno);
  }
  saveaccount() {
    this.userService.markSelfMerchantVerified(this.user.id, this.accountpro.ifsc, this.accountpro.accountRefNumber,
      this.accountpro.panNumber, this.accountpro.bankName,
      this.businesspro.contactPerson, this.accountpro.accountHolderName, this.accountpro.filePassword);
  }
  getSwitchText(flag: boolean) {
    if (flag)
      return 'On';

    return 'Off';
  }

  setConvenience() {
    this.userService.setConvenienceFee(this.user.id, this.chargeFee);
  }
  validategst(res) {
    var res1 = res.toUpperCase();
    this.businesspro.gstno = res1;
    var gst1 = this.businesspro.gstno;
    var reg = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (gst1.match(reg)) {
      this.errgstvalidate = false;
    }
    else {
      this.errgstvalidate = true;
      this.errorgst = 'Please enter correct GSTIN.'
    }

  }
  validatePAN() {
    var panFormat = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    if (panFormat.test(this.accountpro.panNumber)) {
      this.errpancard = false;
    }
    else {
      this.errpancard = true;
      this.errorpanmsg = 'Please enter correct PAN card number';
    }
  }
  validateifsc() {
    var ifsc = this.accountpro.ifsc;
    var reg = /[A-Z|a-z]{4}[0][a-zA-Z0-9]{6}$/;

    if (ifsc.match(reg)) {
      this.errvalidate = false;

    }
    else {
      this.errvalidate = true;
      this.errorifsc = 'Please enter correct IFSC code.'
    }
  }
  savepincode() {
    var pincode = this.businesspro.pincode;
    //console.log(pincode);
    if (pincode.length == 6) {
      this.errpincodevalidate = false;
    }
    else {
      this.errpincodevalidate = true;
      this.errorpincode = 'Please enter correct Pincode.';
    }

  }
  validatebusiness() {
    var TCode1 = this.businesspro.businessName;

    if (/^[a-zA-Z0-9\-\s]+$/.test(TCode1)) {

      this.errbusinessvalidate = false;
    } else {
      this.errbusinessvalidate = true;
      this.errorbusiness = 'Business name should not contain special symbol.';

    }
  }

  validaatedisplay() {
    var TCode = this.user.displayName;
    if (/^[a-zA-Z0-9\-\s]+$/.test(TCode)) {
      this.errdisplayvalidate = false;

    } else {
      this.errdisplayvalidate = true;
      this.errordisplay = 'Special Character are Not allowed.';

    }
  }
  hasAllFields() {
    return this.businesspro.contactPerson && this.user.email && this.user.mobileNumber;
  }
  hasAllFields1() {
    return !this.errpincodevalidate && !this.errbusinessvalidate && !this.errdisplayvalidate
      && this.user.displayName && this.businesspro.businessName && this.businesspro.pincode && this.businesspro.address;
  }
  hasAllFields2() {
    return !this.errpancard && this.accountpro.panNumber;
  }
  hasAllFields3() {
    return !this.errpancard && this.accountpro.panNumber;
  }
  UpCase(res) {
    var res1 = res.toUpperCase();
    this.accountpro.accountHolderName = res1;
    return this.accountpro.accountHolderName;
  }
  hasAllFields4() {
    return !this.errvalidate && this.accountpro.accountHolderName && this.accountpro.accountRefNumber
      && this.accountpro.ifsc && this.conaccountnumber && !this.err;
  }
  Accountno() {
    if ((((this.accountpro.accountRefNumber).length) <= 5) && (((this.conaccountnumber).length) <= 5)) {
      this.err = true;
      this.errmsg = 'Account number should be 6 digits!';

    } else {
      if (this.accountpro.accountRefNumber.trim() == this.conaccountnumber.trim()) {
        this.err = false;
      }
      else {
        this.err = true;
        this.errmsg = 'Account number do not match!';
      }
    }
  }

  hasAllFields5() {
    return !this.errgstvalidate && this.businesspro.gstno;
  }

  edit() {
    this.editt = false;
  }
  
}


