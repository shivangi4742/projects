import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { TranslateService } from 'ng2-translate';
import { UtilsService, User, UserService, StoreService, Status, Accountpro, Businesspro, Merchant, Locality, LocationService, FileService } from 'benowservices';
import { resolve } from 'url';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  accountpro: Accountpro;
  codEnabled: boolean = false;
  formLoaded: boolean = true;
  businesspro: Businesspro;
  chargeFee: boolean = false;
  imageUrls: string;
  user: User;
  avilable: boolean = false;
  conaccountnumber: string;
  gstno: string;
  businessset: boolean = false;
  sellercontac: boolean = false;
  isShipped: boolean = false;
  isReturn: boolean = false;
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
  codExpanded : boolean = false;
  err: boolean = false;
  err1: boolean = false;
  errmsg: string;
  errmsg1: string;
  editt: boolean;
  imgErrMsg: string;
  data: any;
  isImageProcess: boolean = false;
  uploadsURL: string;
  uploading: boolean = false;
  uploaded: boolean = false;
  publicphonenumber: boolean = true;
  publicemail: boolean = true;
  Min: boolean = true;
  day: boolean = false;
  hour: boolean = false;
  storeLogo: string;
  uploadbannnerURL:string;
  localitychip;
  exchfaulty: boolean = true;
  filchange: boolean = false;
  storeerr:boolean = false;
  dlocality = new Array<Locality>();
  
  
  constructor(private translate: TranslateService,private storeservice: StoreService, private utilsService: UtilsService, private locationService: LocationService,
    private userService: UserService, private route: ActivatedRoute, private fileService: FileService) { }

  ngOnInit() {
    this.locationService.setLocation('settings');
    this.utilsService.setStatus(false, false, '');

    this.userService.getUser()
      .then(res => this.init(res));
      this.localitychip = {
        placeholder: '+locality',
        secondaryPlaceholder: 'please Enter',
        autocompleteOptions: {
          data: {
           },
          limit: Infinity,
          minLength: 1
        }
      };
  }
  init(usr: User) {
    if (usr && usr.id) {
      this.user = usr;
      this.uploadsURL = this.utilsService.getUploadsURL1();
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
      .then(mres => this.businessprfo(mres));

    this.userService.getMerchantDetails(this.user.merchantCode)
      .then(res => this.bind(res));

    this.storeservice.fetchStoreimagDetais(this.user.email, this.user.id)
      .then(res => this.logourl(res));

    //this.storeurlcheck();
  }
  
  logourl(res) {
      var data = res.data;
        if (data && data.documentResponseVO) {
            var p = data.documentResponseVO.documentList;
            if (p && p.length > 0) {
                for (var i = 0; i < p.length; i++) {
                    if (p[i].documentName == 'Merchant_logo')
                        this.storeLogo = p[i].documentUrl;
                    if (p[i].documentName == 'Merchant_Banner')
                        this.uploadbannnerURL = p[i].documentUrl;
                             
                }
            }
        }
  }

  businessprfo(res: any) {
      this.businesspro = res;
      console.log(this.businesspro,'hehe');
    if (this.businesspro && this.businesspro.contactPerson) {
      this.editt = true;
    }
    else {
      this.editt = false;
    }
    if (this.businesspro && this.businesspro.publicEmail) {
      this.publicemail = true;
    }
    else {
      this.publicemail = false;
    }
    if (this.businesspro && this.businesspro.publicPhoneNumber) {
      this.publicphonenumber = true;
    }
    else {
      this.publicphonenumber = false;
    }
  }
  bind(res: any) {
    if (res && res.id) {
      this.chargeFee = res.chargeConvenienceFee;
      if (this.route.snapshot.params['open']) {
        let elem: any = document.getElementById(this.route.snapshot.params['open']);
        if (elem)
          elem.click();
      }
      if(res.acceptedPaymentMethods && res.acceptedPaymentMethods.length > 0) {
        for(let i: number = 0; i < res.acceptedPaymentMethods.length; i++) {
           
            if(res.acceptedPaymentMethods[i].paymentMethod == 'CASH')
                this.codEnabled = true;
        }
    }
    }

    this.formLoaded = false;
  }

  initcheckacc(res: any) {
    this.accountpro = res;
    if (this.accountpro && this.accountpro.accountRefNumber) {
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
    this.businessset = false;
    this.isShipped = false;
    this.isReturn = false;
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
    this.businessset = false;
    this.isPanExpanded = false;
    this.isNgoExpanded = false;
    this.isShipped = false;
    this.isReturn = false;
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
    this.isShipped = false;
    this.isReturn = false;
    this.isPaymentExpanded = false;
    this.ispan1Expanded = false;
    this.businessset = false;
  }

  bankdetails() {
    window.scrollTo(0, 0);
    this.isPanExpanded = !this.isPanExpanded;
    document.getElementById('acbns').click();
  }

  bankdetail11() {
    this.isPanExpanded = !this.isPanExpanded;
    this.isAcctExpanded = false;
    this.businessset = false;
    this.isBusExpanded = false;
    this.isNgoExpanded = false;
    this.isPaymentExpanded = false;
    this.ispan1Expanded = false;
    this.isShipped = false;
    this.isReturn = false;
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
    this.isShipped = false
    this.isReturn = false;
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
    this.isShipped = false;
    this.isReturn = false;
    this.businessset = false;
  }
  returnploicy() {
    window.scrollTo(0, 0);
    this.isReturn = !this.isReturn;
    document.getElementById('returnBN').click();
    
  }

  returnploicy1() {
    this.isReturn = !this.isReturn;
    this.isNgoExpanded = false;
    this.isAcctExpanded = false;
    this.isBusExpanded = false;
    this.isPanExpanded = false;
    this.isPaymentExpanded = false;
    this.ispan1Expanded = false;
    this.isShipped = false
    this.businessset = false;
    if(this.businesspro.contactSeller) {
      let ids: any = document.getElementById('s1');
      if (ids) {
        ids.click();
      }
    }
    if(this.businesspro.noReturnExchange) {
      let id2s: any = document.getElementById('s2');
      if (id2s) {
        id2s.click();
      }
   }
   if(this.businesspro.productExchange && this.businesspro.productExchangeDay) {
    let id3s: any = document.getElementById('s3');
    if (id3s) {
      id3s.click();
    }
   }
   if(this.businesspro.productReturnOrExchange && this.businesspro.productReturnOrExchangeDay) {
    let id4s: any = document.getElementById('s4');
      if (id4s) {
        id4s.click();
      }
   }
   if(this.businesspro.returnAvailable && this.businesspro.returnsAvailableDay) {
     let id5s: any = document.getElementById('s5');
     if (id5s) {
       id5s.click();
     }
   }
   if(this.businesspro.noExchangeFlage) {
    let id6s: any = document.getElementById('s6');
      if (id6s) {
        id6s.click();
      }
   }
   if(this.businesspro.noReturnFlage) {
    let id7s: any = document.getElementById('s7');
      if (id7s) {
        id7s.click();
      }
   }
    
  }
  shippingsetting() {
    window.scrollTo(0, 0);
    this.isShipped = !this.isShipped;
    document.getElementById('shippingbn').click();
  }

  shippingsetting1() {
   
    this.isShipped = !this.isShipped;
    this.isReturn = false;
    this.isNgoExpanded = false;
    this.isAcctExpanded = false;
    this.isBusExpanded = false;
    this.isPanExpanded = false;
    this.isPaymentExpanded = false;
    this.ispan1Expanded = false;
    this.businessset = false;
    if(this.businesspro.allOverIndia) {
      let il1s: any = document.getElementById('l1');
        if (il1s) {
          il1s.click();
        }
     }
     if(this.businesspro.selectLocalities) {
      let il2s: any = document.getElementById('l2');
        if (il2s) {
          il2s.click();
        }
     }
     if(this.businesspro.freeShip) {
      let is1s: any = document.getElementById('sj');
        if (is1s) {
          is1s.click();
          this.shiping1()
        }
     }
     if(this.businesspro.chargePerOrder) {
      let is2s: any = document.getElementById('sj1');
        if (is2s) {
          is2s.click();
          this.shiping2();
        }
     }
     if(this.businesspro.chargePerProd) {
      let is3s: any = document.getElementById('sj2');
        if (is3s) {
          is3s.click();
          this.shiping3()
        }
     }
     
  }
  sellercontact() {
    window.scrollTo(0, 0);
    this.sellercontac = !this.sellercontac;
    document.getElementById('sellerbn').click();
  }

  sellercontact1() {
    this.sellercontac = !this.sellercontac;
    this.businessset = false;
    this.isReturn = false;
    this.isNgoExpanded = false;
    this.isAcctExpanded = false;
    this.isBusExpanded = false;
    this.isPanExpanded = false;
    this.isPaymentExpanded = false;
    this.ispan1Expanded = false;
    this.isShipped = false
  }
  businesssetting() {
    window.scrollTo(0, 0);
    this.businessset = !this.businessset;
    document.getElementById('returnBN').click();
  }

  businesssetting1() {
    this.businessset = !this.businessset;
    this.isShipped = false;
    this.isReturn = false;
    this.isNgoExpanded = false;
    this.isAcctExpanded = false;
    this.isBusExpanded = false;
    this.isPanExpanded = false;
    this.isPaymentExpanded = false;
    this.ispan1Expanded = false;
  }
  coddetail() {
    window.scrollTo(0, 0);
    this.codExpanded = !this.codExpanded;
    document.getElementById('codbn').click();
  }

  coddetail1() {
    this.codExpanded = !this.codExpanded;
    this.businessset = false;
    this.isShipped = false;
    this.isReturn = false;
    this.isNgoExpanded = false;
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
    this.isShipped = false;
    this.isReturn = false;
    this.isNgoExpanded = false;
    this.isAcctExpanded = false;
    this.isBusExpanded = false;
    this.isPanExpanded = false;
    this.isPaymentExpanded = false;
    this.ispan1Expanded = false;
    if (this.businesspro.gstno) {
      let ids: any = document.getElementById('test1');
      if (ids) {
        ids.click();
      }
    }
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
  returnploicysave() { 
    console.log(this.businesspro.contactSeller, this.businesspro.noReturnExchange, this.businesspro.productExchange, this.businesspro.productExchangeDay, this.businesspro.productReturnOrExchange, this.businesspro.productReturnOrExchangeDay, this.businesspro.returnAvailable,
      this.businesspro.returnsAvailableDay, this.businesspro.noExchangeFlage, this.businesspro.noReturnFlage, this.businesspro.publicPhoneNumber, this.businesspro.publicEmail, this.businesspro.storeUrl, this.businesspro.storeImgUrl,
      this.businesspro.shipTimeType, this.businesspro.shipTimeInterval, this.businesspro.allOverIndia, this.businesspro.selectLocalities,
      this.businesspro.area,this.businesspro.freeShip, this.businesspro.chargePerOrder, this.businesspro.orderShipCharge, this.businesspro.chargePerProd,'fhjkdshfkdkfjkddkkkkkkkkkkkkkkkkkkkkkk');
     this.userService.registerSelfMerchant(this.user.id, this.businesspro.businessName,
      this.businesspro.contactEmailId, this.businesspro.category, this.businesspro.subCategory, this.businesspro.city,
      this.businesspro.locality, this.businesspro.contactPerson, this.businesspro.address,
      this.businesspro.contactEmailId, this.businesspro.businessTypeCode, this.businesspro.businessType,
      this.businesspro.pincode, this.businesspro.gstno, this.businesspro.contactSeller, this.businesspro.noReturnExchange, this.businesspro.productExchange, this.businesspro.productExchangeDay, this.businesspro.productReturnOrExchange, this.businesspro.productReturnOrExchangeDay, this.businesspro.returnAvailable,
      this.businesspro.returnsAvailableDay, this.businesspro.noExchangeFlage, this.businesspro.noReturnFlage, this.businesspro.publicPhoneNumber, this.businesspro.publicEmail, this.businesspro.storeUrl, this.businesspro.storeImgUrl,
      this.businesspro.shipTimeType, this.businesspro.shipTimeInterval, this.businesspro.allOverIndia, this.businesspro.selectLocalities,
      this.businesspro.area,this.businesspro.freeShip, this.businesspro.chargePerOrder, this.businesspro.orderShipCharge, this.businesspro.chargePerProd
    ).then(res => this.shippingsetting());
    
  }
  shippingploicysave() {
    console.log(this.businesspro.freeShip, this.businesspro.chargePerOrder, this.businesspro.orderShipCharge, this.businesspro.chargePerProd);
    this.userService.registerSelfMerchant(this.user.id, this.businesspro.businessName,
     this.businesspro.contactEmailId, this.businesspro.category, this.businesspro.subCategory, this.businesspro.city,
     this.businesspro.locality, this.businesspro.contactPerson, this.businesspro.address,
     this.businesspro.contactEmailId, this.businesspro.businessTypeCode, this.businesspro.businessType,
     this.businesspro.pincode, this.businesspro.gstno, this.businesspro.contactSeller, this.businesspro.noReturnExchange, this.businesspro.productExchange, this.businesspro.productExchangeDay, this.businesspro.productReturnOrExchange, this.businesspro.productReturnOrExchangeDay, this.businesspro.returnAvailable,
     this.businesspro.returnsAvailableDay, this.businesspro.noExchangeFlage, this.businesspro.noReturnFlage, this.businesspro.publicPhoneNumber, this.businesspro.publicEmail, this.businesspro.storeUrl, this.businesspro.storeImgUrl,
     this.businesspro.shipTimeType, this.businesspro.shipTimeInterval, this.businesspro.allOverIndia, this.businesspro.selectLocalities,
     this.businesspro.area, this.businesspro.freeShip, this.businesspro.chargePerOrder, this.businesspro.orderShipCharge, this.businesspro.chargePerProd
   ).then(res => this.paymentdetail());
   
 }
 savecod(){
   this.paymentsave();
 }
 paymentsave(){
  this.userService.registerSelfMerchant(this.user.id, this.businesspro.businessName,
    this.businesspro.contactEmailId, this.businesspro.category, this.businesspro.subCategory, this.businesspro.city,
    this.businesspro.locality, this.businesspro.contactPerson, this.businesspro.address,
    this.businesspro.contactEmailId, this.businesspro.businessTypeCode, this.businesspro.businessType,
    this.businesspro.pincode, this.businesspro.gstno, this.businesspro.contactSeller, this.businesspro.noReturnExchange, this.businesspro.productExchange, this.businesspro.productExchangeDay, this.businesspro.productReturnOrExchange, this.businesspro.productReturnOrExchangeDay, this.businesspro.returnAvailable,
    this.businesspro.returnsAvailableDay, this.businesspro.noExchangeFlage, this.businesspro.noReturnFlage, this.businesspro.publicPhoneNumber, this.businesspro.publicEmail, this.businesspro.storeUrl, this.businesspro.storeImgUrl,
    this.businesspro.shipTimeType, this.businesspro.shipTimeInterval, this.businesspro.allOverIndia, this.businesspro.selectLocalities,
    this.businesspro.area, this.businesspro.freeShip, this.businesspro.chargePerOrder, this.businesspro.orderShipCharge, this.businesspro.chargePerProd
  ).then(res => this.sellercontact());
}
  
  sellercontactsave(){
    this.userService.registerSelfMerchant(this.user.id, this.businesspro.businessName,
      this.businesspro.contactEmailId, this.businesspro.category, this.businesspro.subCategory, this.businesspro.city,
      this.businesspro.locality, this.businesspro.contactPerson, this.businesspro.address,
      this.businesspro.contactEmailId, this.businesspro.businessTypeCode, this.businesspro.businessType,
      this.businesspro.pincode, this.businesspro.gstno, this.businesspro.contactSeller, this.businesspro.noReturnExchange, this.businesspro.productExchange, this.businesspro.productExchangeDay, this.businesspro.productReturnOrExchange, this.businesspro.productReturnOrExchangeDay, this.businesspro.returnAvailable,
      this.businesspro.returnsAvailableDay, this.businesspro.noExchangeFlage, this.businesspro.noReturnFlage, this.businesspro.publicPhoneNumber, this.businesspro.publicEmail, this.businesspro.storeUrl, this.businesspro.storeImgUrl,
      this.businesspro.shipTimeType, this.businesspro.shipTimeInterval, this.businesspro.allOverIndia, this.businesspro.selectLocalities,
      this.businesspro.area, this.businesspro.freeShip, this.businesspro.chargePerOrder, this.businesspro.orderShipCharge, this.businesspro.chargePerProd
    ).then(res => this.personaldetail());
  }
  personalsave(){
    this.userService.registerSelfMerchant(this.user.id, this.businesspro.businessName,
      this.businesspro.contactEmailId, this.businesspro.category, this.businesspro.subCategory, this.businesspro.city,
      this.businesspro.locality, this.businesspro.contactPerson, this.businesspro.address,
      this.businesspro.contactEmailId, this.businesspro.businessTypeCode, this.businesspro.businessType,
      this.businesspro.pincode, this.businesspro.gstno, this.businesspro.contactSeller, this.businesspro.noReturnExchange, this.businesspro.productExchange, this.businesspro.productExchangeDay, this.businesspro.productReturnOrExchange, this.businesspro.productReturnOrExchangeDay, this.businesspro.returnAvailable,
      this.businesspro.returnsAvailableDay, this.businesspro.noExchangeFlage, this.businesspro.noReturnFlage, this.businesspro.publicPhoneNumber, this.businesspro.publicEmail, this.businesspro.storeUrl, this.businesspro.storeImgUrl,
      this.businesspro.shipTimeType, this.businesspro.shipTimeInterval, this.businesspro.allOverIndia, this.businesspro.selectLocalities,
      this.businesspro.area, this.businesspro.freeShip, this.businesspro.chargePerOrder, this.businesspro.orderShipCharge, this.businesspro.chargePerProd
    ).then(res => this.bankdetails());
  }
  businesssave(){
    this.userService.registerSelfMerchant(this.user.id, this.businesspro.businessName,
      this.businesspro.contactEmailId, this.businesspro.category, this.businesspro.subCategory, this.businesspro.city,
      this.businesspro.locality, this.businesspro.contactPerson, this.businesspro.address,
      this.businesspro.contactEmailId, this.businesspro.businessTypeCode, this.businesspro.businessType,
      this.businesspro.pincode, this.businesspro.gstno, this.businesspro.contactSeller, this.businesspro.noReturnExchange, this.businesspro.productExchange, this.businesspro.productExchangeDay, this.businesspro.productReturnOrExchange, this.businesspro.productReturnOrExchangeDay, this.businesspro.returnAvailable,
      this.businesspro.returnsAvailableDay, this.businesspro.noExchangeFlage, this.businesspro.noReturnFlage, this.businesspro.publicPhoneNumber, this.businesspro.publicEmail, this.businesspro.storeUrl, this.businesspro.storeImgUrl,
      this.businesspro.shipTimeType, this.businesspro.shipTimeInterval, this.businesspro.allOverIndia, this.businesspro.selectLocalities,
      this.businesspro.area, this.businesspro.freeShip, this.businesspro.chargePerOrder, this.businesspro.orderShipCharge, this.businesspro.chargePerProd
    ).then(res => this.accountdetail());

  }
  saveaccount() {
    this.userService.markSelfMerchantVerified(this.user.id, this.accountpro.ifsc, this.accountpro.accountRefNumber,
      this.accountpro.panNumber, this.accountpro.bankName,this.businesspro.contactPerson, 
      this.accountpro.accountHolderName, this.accountpro.filePassword).then(res => this.bankdetail());
  }
  banksaveaccount(){
    this.userService.markSelfMerchantVerified(this.user.id, this.accountpro.ifsc, this.accountpro.accountRefNumber,
      this.accountpro.panNumber, this.accountpro.bankName,this.businesspro.contactPerson, 
      this.accountpro.accountHolderName, this.accountpro.filePassword).then(res => this.gstdetail());
  }
  gstsave(){
    this.userService.registerSelfMerchant(this.user.id, this.businesspro.businessName,
      this.businesspro.contactEmailId, this.businesspro.category, this.businesspro.subCategory, this.businesspro.city,
      this.businesspro.locality, this.businesspro.contactPerson, this.businesspro.address,
      this.businesspro.contactEmailId, this.businesspro.businessTypeCode, this.businesspro.businessType,
      this.businesspro.pincode, this.businesspro.gstno, this.businesspro.contactSeller, this.businesspro.noReturnExchange, this.businesspro.productExchange, this.businesspro.productExchangeDay, this.businesspro.productReturnOrExchange, this.businesspro.productReturnOrExchangeDay, this.businesspro.returnAvailable,
      this.businesspro.returnsAvailableDay, this.businesspro.noExchangeFlage, this.businesspro.noReturnFlage, this.businesspro.publicPhoneNumber, this.businesspro.publicEmail, this.businesspro.storeUrl, this.businesspro.storeImgUrl,
      this.businesspro.shipTimeType, this.businesspro.shipTimeInterval, this.businesspro.allOverIndia, this.businesspro.selectLocalities,
      this.businesspro.area, this.businesspro.freeShip, this.businesspro.chargePerOrder, this.businesspro.orderShipCharge, this.businesspro.chargePerProd
    );

  }
  getSwitchText(flag: boolean) {
    if (flag)
      return 'On';

    return 'Off';
  }

  setConvenience() {
    this.userService.setConvenienceFee(this.user.id, this.chargeFee);
  }
  setCOD() {        
    this.userService.setCOD(this.user.merchantCode, this.codEnabled);
    }
    
  validategst(res) {
    var res1 = res.toUpperCase();
    this.businesspro.gstno = res1;
    var gst1 = this.businesspro.gstno.trim();
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
    if (panFormat.test(this.accountpro.panNumber.trim())) {
      this.errpancard = false;
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
    } else {
      this.errbusinessvalidate = true;
      this.errorbusiness = 'Business name should not contain special symbol.';

    }
  }

  validaatedisplay() {
    var TCode = this.user.displayName.trim();
    if (/^[a-zA-Z0-9\-\s]+$/.test(TCode)) {
      this.errdisplayvalidate = false;

    } else {
      this.errdisplayvalidate = true;
      this.errordisplay = 'Special character are not allowed.';

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
    if (((this.accountpro.accountRefNumber.trim()).length) > 0 && ((this.accountpro.accountRefNumber.trim()).length) <= 5) {
      this.err = true;
      this.errmsg = 'Account number should be 6 digits!';

    } else {
      this.err = false;
      this.Accountno1();
    }

  }
  Accountno1() {
    if ((((this.conaccountnumber.trim()).length) > 0) && (((this.conaccountnumber.trim()).length) <= 5)) {
      this.err1 = true;
      this.errmsg1 = 'Account number should be 6 digits!';

    } else {
      if (this.accountpro.accountRefNumber.trim() == this.conaccountnumber.trim()) {
        this.err1 = false;
      }
      else {
        this.err1 = true;
        this.errmsg1 = 'Account number do not match!';
      }
    }
  }

  hasAllFields5() {
    if (this.businesspro.gstno) {
      return !this.errgstvalidate && this.businesspro.gstno;
    }
    else {
      return this.businesspro.gstno;
    }
  }

  edit() {
    this.editt = false;
    let asa: any = document.getElementById('contactPerson');
    if (asa) {
      asa.focus();
    }
  }
  bannerChange(e: any) {
    this.uploading = true;
    if (e.target && e.target.files) {
      if (e.target.files && e.target.files[0]) {
        this.utilsService.setStatus(false, false, '');
        if (e.target.files[0].size > 5000000) {
          window.scrollTo(0, 0);
          this.utilsService.setStatus(true, false, 'File is bigger than 1 MB!');//5 MB
        }
        else {
          this.fileService.upload2(e.target.files[0], this.user.id, "MERCHANT_REG", "Merchant_Banner", "Merchant_Bannner", this.uploadedbannerImage, this);
        }
        e.target.value = '';
      }
    }
  }

  uploadedbannerImage(res: any, me: any) {
    console.log(res, 'res');
    if (res && res.success) {

      me.uploadbannnerURL = res.documentUrl;
      me.uploading= false;
     
    }
    else {
      window.scrollTo(0, 0);
      me.utilsService.setStatus(true, false, res.errorMsg ? res.errorMsg : 'Something went wrong. Please try again.');
    }
  }

  fileChange(e: any) {
    this.uploaded = true;
    if (e.target && e.target.files) {
      if (e.target.files && e.target.files[0]) {
        this.utilsService.setStatus(false, false, '');
        if (e.target.files[0].size > 5000000) {
          window.scrollTo(0, 0);
          this.utilsService.setStatus(true, false, 'File is bigger than 1 MB!');//5 MB
        }
        else {
          this.fileService.upload2(e.target.files[0], this.user.id, "MERCHANT_REG", "Merchant_logo", "Merchant_logo", this.uploadedImage, this);
        }
        e.target.value = '';
      }
    }
  }

  uploadedImage(res: any, me: any) {
    console.log(res, 'res');
    if (res && res.success) {
      me.storeLogo = res.documentUrl;
      me.uploaded = false;
      me.numImages = me.numImages + 1;
    }
    else {
      window.scrollTo(0, 0);
      me.utilsService.setStatus(true, false, res.errorMsg ? res.errorMsg : 'Something went wrong. Please try again.');
    }
  }
  

  phoneedit() {
    this.publicphonenumber = !this.publicphonenumber;
  }
  emailedit() {
    this.publicemail = !this.publicemail;
  }
  min() {
    this.Min = !this.Min;
    this.hour = false;
    this.day = false;
    this.businesspro.shipTimeType = 'minute';
  }
  hours() {
    this.hour = !this.hour;
    this.day = false;
    this.Min = false;
    this.businesspro.shipTimeType = 'hours';
  }
  days() {
    this.day = !this.day;
    this.hour = false;
    this.Min = false;
    this.businesspro.shipTimeType = 'days';
  }
  addProdlocality(res:any){
    this.dlocality.push(new Locality(res.tag));  
  }
  deleteProdlocality(res:any){

  }
  locality(){
      this.businesspro.allOverIndia = true;
      this.businesspro.selectLocalities = false;
    
  }
    locality1(){
      this.businesspro.selectLocalities = true;
      this.businesspro.allOverIndia = false;
    
  }
  shiping1(){
      this.businesspro.freeShip = true;
      this.businesspro.chargePerOrder= false;
      this.businesspro.chargePerProd = false;
      this.businesspro.orderShipCharge= "";
     
    
  }
  shiping2(){
      this.businesspro.freeShip = false;
      this.businesspro.chargePerOrder= true;
      this.businesspro.chargePerProd = false;
     
  }
  shiping3(){
    this.businesspro.freeShip = false;
      this.businesspro.chargePerOrder= false;
      this.businesspro.chargePerProd = true;
      this.businesspro.orderShipCharge = "";
      
  }
  contactseller(res:any) {
    this.businesspro.contactSeller = true;
    this.businesspro.noReturnExchange = false;
    this.businesspro.returnAvailable = false;
    this.businesspro.productExchange = false;
    this.businesspro.noExchangeFlage = false;
    this.businesspro.productReturnOrExchange = false;
    this.businesspro.noReturnFlage = false;
    this.businesspro.productExchangeDay = '';
    this.businesspro.productReturnOrExchangeDay = '';
    this.businesspro.returnsAvailableDay = '';

  }
  noReturnExchange(res:any){
    this.businesspro.noReturnExchange = true;
    this.businesspro.contactSeller = false;
    this.businesspro.returnAvailable = false;
    this.businesspro.productExchange = false;
    this.businesspro.noExchangeFlage = false;
    this.businesspro.noReturnFlage = false;
    this.businesspro.productReturnOrExchange = false;
    this.businesspro.productExchangeDay = '';
    this.businesspro.productReturnOrExchangeDay = '';
    this.businesspro.returnsAvailableDay = '';
  }
  returnAvailable(res:any){
    this.businesspro.returnAvailable = true;
    this.businesspro.noReturnExchange = false;
    this.businesspro.contactSeller = false;
    this.businesspro.productExchange = false;
    this.businesspro.noExchangeFlage = false;
    this.businesspro.productReturnOrExchange = false;
    this.businesspro.productExchangeDay = '';
    this.businesspro.noReturnFlage = false;
    this.businesspro.productReturnOrExchangeDay = '';

  }
  productExchange(res:any){
    this.businesspro.productExchange= true;
    this.businesspro.noReturnExchange = false;
    this.businesspro.contactSeller = false;
    this.businesspro.returnAvailable = false;
    this.businesspro.noExchangeFlage = false;
    this.businesspro.productReturnOrExchange = false;
    this.businesspro.noReturnFlage = false;
    this.businesspro.productReturnOrExchangeDay = '';
    this.businesspro.returnsAvailableDay = '';
  }
  noExchangeFlage(res:any){
    this.businesspro.noExchangeFlage = true;
    this.businesspro.productExchange= false;
    this.businesspro.noReturnExchange = false;
    this.businesspro.contactSeller = false;
    this.businesspro.returnAvailable = false;
    this.businesspro.productReturnOrExchange = false;
    this.businesspro.noReturnFlage = false;
    this.businesspro.productReturnOrExchangeDay = '';
    this.businesspro.returnsAvailableDay = '';
    this.businesspro.productExchangeDay = '';
    
  }
  noReturnFlage(res:any){
    this.businesspro.noReturnFlage = true;
    this.businesspro.productExchange= false;
    this.businesspro.contactSeller = false;
    this.businesspro.returnAvailable = false;
    this.businesspro.productReturnOrExchange = false;
    this.businesspro.noExchangeFlage = false;
    this.businesspro.productReturnOrExchangeDay = '';
    this.businesspro.returnsAvailableDay = '';
    this.businesspro.productExchangeDay = '';
   
  }
  productReturnOrExchange(res:any){
    this.businesspro.productReturnOrExchange = true;
    this.businesspro.productExchange= false;
    this.businesspro.noReturnFlage = false;
    this.businesspro.noReturnExchange = false;
    this.businesspro.contactSeller = false;
    this.businesspro.returnAvailable = false;
    this.businesspro.noExchangeFlage = false;
    this.businesspro.productExchangeDay = '';
    this.businesspro.returnsAvailableDay = '';

  }
  storeurl(){
    var p = this.businesspro.storeUrl;
    var t = p.replace(/\s/g,'');
    this.businesspro.storeUrl = t;
    if (((/^[a-zA-Z0-9\-\s]+$/).test(this.businesspro.storeUrl)) &&  this.businesspro.storeUrl != 'benow' &&  this.businesspro.storeUrl != 'givnow' &&  this.businesspro.storeUrl!= 'givnow' &&  this.businesspro.storeUrl != 'pay' &&  this.businesspro.storeUrl!= 'merchant') {
     this.storeerr = false;
     //this.storeurlcheck();
  }  else {
    this.storeerr= true;
  }
   
  }
  storeurlcheck(){
    this.userService.storavailable(this.businesspro.storeUrl)
      .then(res => this.storecheckavailable(res));

  }
  storecheckavailable(res:any){
    console.log(res);
    if(res.data.responseFromAPI == false){
       this.avilable= true;
    } else{
      this.avilable= false;
    }
  }
  
}


