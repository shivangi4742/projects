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
  name: string;
  email: string;
  mobilenumber: string;
  Password: string;
  user: User;
  DisplayName: string;
  businessName: string;
  BusinessAddress: string;
  pincode: string;
  PANNumber: string;
  accountholdername: string;
  accountnumber: string;
  conaccountnumber: string;
  IFSC: string;
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
  errbusinessvalidate:boolean =false;
  errorbusiness:string;
   errdisplayvalidate:boolean =false;
  errordisplay:string;



  constructor(private translate: TranslateService, private utilsService: UtilsService,
    private userService: UserService) { }

  ngOnInit() {
    this.utilsService.setStatus(false, false, '');
    this.userService.getUser()
      .then(res => this.init(res));
  }
  init(usr: User) {
    console.log(usr, 'usr');
    if (usr && usr.id) {
      this.user = usr;
      this.translate.use(this.utilsService.getLanguageCode(this.user.language));

      this.userService.getfetchMerchantForEditDetails(this.user.email, this.user.id)
        .then(res => this.initDetails(res));


      this.loadForm();
    }

  }
  initDetails(res: any) {
    console.log(res);
  }
  loadForm() {

    this.userService.checkMerchant(this.user.mobileNumber, "a")
      .then(ares => this.accountpro = ares);

    this.userService.checkMerchant(this.user.mobileNumber, "b")
      .then(mres => this.businesspro = mres);


    this.formLoaded = true;
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
    this.userService.registerSelfMerchant('46873', this.businesspro.businessName,
      this.businesspro.address, this.businesspro.category, this.businesspro.subCategory, this.businesspro.city,
      this.businesspro.locality, this.businesspro.contactPerson, this.businesspro.address,
      this.businesspro.contactPerson, this.businesspro.businessName, this.businesspro.businessName,
      this.businesspro.pincode, this.businesspro.gstno)
  }
  saveaccount() {
    this.userService.markSelfMerchantVerified('46873', this.accountpro.panNumber,
      this.accountpro.accountHolderName, this.accountpro.accountRefNumber, this.accountpro.ifsc, this.accountpro.bankName,
      this.accountpro.filePassword, this.businesspro.contactPerson);
  }
  getSwitchText(flag: boolean) {
    if (flag)
      return 'On';

    return 'Off';
  }

  setConvenience() {
    // this.kycService.setConvenienceFee(this.user.id, this.chargeFee);
  }
  validategst() {
    console.log(this.businesspro.gstno, 'jeje');
    var gst1 = this.gstno;

    var reg = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (gst1.match(reg)) {
      this.errgstvalidate = false;
      this.userService.registerSelfMerchant(this.user.id, this.businesspro.businessName,
        this.businesspro.contactEmailId, this.businesspro.category,
        this.businesspro.subCategory, this.businesspro.city, this.businesspro.locality,
        this.businesspro.contactPerson, this.businesspro.address,
        this.user.mobileNumber, this.businesspro.businessTypeCode, this.businesspro.businessType, this.businesspro.pincode,
        this.businesspro.gstno);
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
      this.userService.markSelfMerchantVerified(this.user.id, this.accountpro.ifsc, this.accountpro.accountRefNumber,
        this.accountpro.panNumber, this.accountpro.bankName, this.businesspro.contactPerson,
        this.accountpro.accountHolderName, this.accountpro.filePassword);
    }
    else {
      this.errpancard = true;
      this.errorpanmsg = 'Please enter correct PAN card number';
    }
  }
  validateifsc() {
    var ifsc = this.IFSC;
    var reg = /[A-Z|a-z]{4}[0][a-zA-Z0-9]{6}$/;

    if (ifsc.match(reg)) {
      this.errvalidate = false;
      this.userService.markSelfMerchantVerified(this.user.id, this.accountpro.ifsc, this.accountpro.accountRefNumber,
        this.accountpro.panNumber, this.accountpro.bankName, this.businesspro.contactPerson,
        this.accountpro.accountHolderName, this.accountpro.filePassword);
    }
    else {
      this.errvalidate = true;
      this.errorifsc = 'Please enter correct IFSC code.'
    }
  }
  savepincode() {
    var pincode = this.pincode;
    //console.log(pincode);
    if (pincode.length == 6) {
      this.errpincodevalidate = false;
      this.userService.registerSelfMerchant(this.user.id, this.businesspro.businessName,
        this.businesspro.contactEmailId, this.businesspro.category,
        this.businesspro.subCategory, this.businesspro.city, this.businesspro.locality,
        this.businesspro.contactPerson, this.businesspro.address,
        this.user.mobileNumber, this.businesspro.businessTypeCode, this.businesspro.businessType, this.businesspro.pincode,
        this.businesspro.gstno);
    }
    else {
      this.errpincodevalidate = true;
      this.errorpincode = 'Please enter correct Pincode.';
    }

  }
  validatebusiness() {
    var TCode = this.businessName

    if (/[^a-zA-Z0-9\-\/]/.test(TCode)) {
      this.errbusinessvalidate = true;
      this.errorbusiness ='Business name should not contain special symbol.';
     
    } else {
      
      this.errbusinessvalidate = false;
    }
  }
   
    validaatedisplay() {
    var TCode = this.user.displayName;

    if (/[^a-zA-Z0-9\-\/]/.test(TCode)) {
      this.errdisplayvalidate = true;
      this.errordisplay ='Special Character are Not allowed.';
     
    } else {
      
      this.errdisplayvalidate = false;
    }
  }

}
