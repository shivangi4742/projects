import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { Router, ActivatedRoute } from '@angular/router';

import { UtilsService, User, UserService, BusinessType, BusinessCategory, Status, Accountpro, Businesspro, Merchant, LocationService } from 'benowservices';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  accountpro: Accountpro;
  businessType: BusinessType[];
  businessCategory: BusinessCategory[];
  formLoaded: boolean = false;
  businesspro: Businesspro;
  user: User;
  conaccountnumber: string;
  gstno: string;
  isBusExpanded: boolean = false;
  isPanExpanded: boolean = false;
  isAcctExpanded: boolean = false;
  isNgoExpanded: boolean = false;
  isPaymentExpanded: boolean = false;
  isgstExpanded: boolean = false;
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

  constructor(private translate: TranslateService, private router: Router, private utilsService: UtilsService, private locationService: LocationService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.locationService.setLocation('registration');
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

    this.userService.getBusinessType()
      .then(tres => this.businessType = tres);

    this.userService.getDashboardCategories()
      .then(bres => this.businessCategory = bres);

    this.userService.checkMerchant(this.user.mobileNumber, "a")
      .then(ares => this.initcheckacc(ares));

    this.userService.checkMerchant(this.user.mobileNumber, "b")
      .then(mres => this.businesspro = mres);

    this.formLoaded = true;
  }


  initcheckacc(res: any) {
    this.accountpro = res;
    if (this.accountpro.accountRefNumber) {
      this.conaccountnumber = this.accountpro.accountRefNumber;
    }

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
  }

  bankdetails() {
    window.scrollTo(0, 0);
    let a: any = document.getElementById('acbns');
    a.click();
    this.bankdetail11();
  }

  bankdetail11() {
    this.isPanExpanded = !this.isPanExpanded;
    this.isAcctExpanded = false;
    this.isBusExpanded = false;
    this.isNgoExpanded = false;
    this.isPaymentExpanded = false;

  }

  accountdetails() {
    window.scrollTo(0, 0);
    let a: any = document.getElementById('acbn');
    a.click();
    this.accountdetail11();
  }

  accountdetail11() {
    this.isAcctExpanded = !this.isAcctExpanded;
    this.isPanExpanded = false;
    this.isBusExpanded = false;
    this.isNgoExpanded = false;
    this.isPaymentExpanded = false;

  }

  bankdetail() {
    window.scrollTo(0, 0);
    let a: any = document.getElementById('bnkset');
    a.click();
    this.bankdetail1();
  }

  bankdetail1() {
    this.isNgoExpanded = !this.isNgoExpanded;
    this.isAcctExpanded = false;
    this.isBusExpanded = false;
    this.isPanExpanded = false;
    this.isPaymentExpanded = false;

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


  validatePAN() {
    var panFormat = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    if (panFormat.test(this.accountpro.panNumber.trim())) {
      this.errpancard = false;
      this.userService.markSelfMerchantVerified(this.user.id, this.accountpro.ifsc, this.accountpro.accountRefNumber,
      this.accountpro.panNumber, this.accountpro.bankName,
      this.businesspro.contactPerson, this.accountpro.accountHolderName, this.accountpro.filePassword);
    }
    else {
      this.errpancard = true;
      this.errorpanmsg = 'Please enter correct PAN card number';
    }
  }

  validateifsc() {
    var ifsc = this.accountpro.ifsc.trim();
    var reg = /[A-Z|a-z]{4}[0][a-zA-Z0-9]{6}$/;

    if (ifsc.match(reg)) {
      this.errvalidate = false;
      this.userService.markSelfMerchantVerified(this.user.id, this.accountpro.ifsc, this.accountpro.accountRefNumber,
      this.accountpro.panNumber, this.accountpro.bankName,
      this.businesspro.contactPerson, this.accountpro.accountHolderName, this.accountpro.filePassword);

    }
    else {
      this.errvalidate = true;
      this.errorifsc = 'Please enter correct IFSC code.'
    }
  }

  savepincode() {
    var pincode = this.businesspro.pincode.trim();
    //console.log(pincode);
    if (pincode.length == 6) {
      this.errpincodevalidate = false;
       this.userService.registerSelfMerchant(this.user.id, this.businesspro.businessName,
      this.businesspro.contactEmailId, this.businesspro.category, this.businesspro.subCategory, this.businesspro.city,
      this.businesspro.locality, this.businesspro.contactPerson, this.businesspro.address,
      this.businesspro.contactEmailId, this.businesspro.businessTypeCode, this.businesspro.businessType,
      this.businesspro.pincode, this.businesspro.gstno);
    }
    else {
      this.errpincodevalidate = true;
      this.errorpincode = 'Please enter correct Pincode.';
    }

  }

  validatebusiness() {
    var TCode1 = this.businesspro.businessName.trim();

    if (/^[a-zA-Z0-9\-\s]+$/.test(TCode1)) {

      this.errbusinessvalidate = false;
       this.userService.registerSelfMerchant(this.user.id, this.businesspro.businessName,
      this.businesspro.contactEmailId, this.businesspro.category, this.businesspro.subCategory, this.businesspro.city,
      this.businesspro.locality, this.businesspro.contactPerson, this.businesspro.address,
      this.businesspro.contactEmailId, this.businesspro.businessTypeCode, this.businesspro.businessType,
      this.businesspro.pincode, this.businesspro.gstno);
    } else {
      this.errbusinessvalidate = true;
      this.errorbusiness = 'Business name should not contain special symbol.';

    }
  }

  validaatedisplay() {
    var TCode = this.user.displayName.trim();
    if (/^[a-zA-Z0-9\-\s]+$/.test(TCode)) {
      this.errdisplayvalidate = false;
       this.userService.registerSelfMerchant(this.user.id, this.businesspro.businessName,
      this.businesspro.contactEmailId, this.businesspro.category, this.businesspro.subCategory, this.businesspro.city,
      this.businesspro.locality, this.businesspro.contactPerson, this.businesspro.address,
      this.businesspro.contactEmailId, this.businesspro.businessTypeCode, this.businesspro.businessType,
      this.businesspro.pincode, this.businesspro.gstno);

    } else {
      this.errdisplayvalidate = true;
      this.errordisplay = 'Special Character are Not allowed.';

    }
  }

  hasAllFields1() {
    return !this.errpincodevalidate && !this.errbusinessvalidate && !this.errdisplayvalidate
      && this.user.displayName && this.businesspro.businessName && this.businesspro.pincode && this.businesspro.address && 
      !this.errvalidate && this.accountpro.accountHolderName && this.accountpro.accountRefNumber
      && this.accountpro.ifsc && this.conaccountnumber && !this.err && this.businesspro.category && 
      this.businesspro.businessType && !this.errpancard &&
      this.accountpro.panNumber ;
  }


  UpCase(res) {
    var res1 = res.toUpperCase();
    this.accountpro.accountHolderName = res1;
     this.userService.markSelfMerchantVerified(this.user.id, this.accountpro.ifsc, this.accountpro.accountRefNumber,
      this.accountpro.panNumber, this.accountpro.bankName,
      this.businesspro.contactPerson, this.accountpro.accountHolderName, this.accountpro.filePassword);
    return this.accountpro.accountHolderName;
  }


  Accountno() {
    if ((((this.accountpro.accountRefNumber).length) <= 5) && (((this.conaccountnumber).length) <= 5)) {
      this.err = true;
      this.errmsg = 'Account number should be 6 digits!';

    } else {
      if (this.accountpro.accountRefNumber.trim() == this.conaccountnumber.trim()) {
        this.err = false;
         this.userService.markSelfMerchantVerified(this.user.id, this.accountpro.ifsc, this.accountpro.accountRefNumber,
      this.accountpro.panNumber, this.accountpro.bankName,
      this.businesspro.contactPerson, this.accountpro.accountHolderName, this.accountpro.filePassword);


      }
      else {
        this.err = true;
        this.errmsg = 'Account number do not match!';
      }
    }
  }


  savebusinesspro() {
    this.userService.registerSelfMerchant(this.user.id, this.businesspro.businessName,
      this.businesspro.contactEmailId, this.businesspro.category,
      this.businesspro.subCategory, this.businesspro.city, this.businesspro.locality,
      this.businesspro.contactPerson, this.businesspro.address,
      this.user.mobileNumber, this.businesspro.businessTypeCode, this.businesspro.businessType, this.businesspro.pincode,
      this.businesspro.gstno);
  }

  getAndSaveBType() {
    for (let i: number = 0; i < this.businessType.length; i++) {
      if (this.businessType[i].description == this.businesspro.businessType) {
        this.businesspro.businessTypeCode = this.businessType[i].code;
        break;
      }
    }
    // this.savebusinesspro();
  }

 /* completeRegistration1() {
     this.router.navigateByUrl('/thanksregistrationprocess')

  }
*/
  completeRegistration1() {
    this.userService.MerchantCompleteRegistration()
      .then(res => this.completepost(res));

  }

  completepost(res: any) {
    if (res.data.responseFromAPI == true) {
      this.router.navigateByUrl('/thanksregistrationprocess')
    }
  }
}
