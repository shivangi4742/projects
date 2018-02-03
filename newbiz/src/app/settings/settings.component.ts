import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { TranslateService } from 'ng2-translate';
import { UtilsService, User, UserService, Status } from 'benowservices';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  chargeFee: boolean = false;
  name: string;
  email: string;
  mobilenumber: string;
  Password: string;
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
  gst: boolean = false;


  constructor(private translate: TranslateService, private utilsService: UtilsService,
    private userService: UserService) { }

  ngOnInit() {
  }
  accountdetail() {
    window.scrollTo(0, 0);
    this.isBusExpanded = !this.isBusExpanded;
    document.getElementById('acbn').click();
  }

  paymentdetail1() {
    this.isPaymentExpanded = !this.isPaymentExpanded;
    this.isBusExpanded = false;
    this.isAcctExpanded = false;
    this.isPanExpanded = false;
    this.isNgoExpanded = false;
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
    this.isPanExpanded = !this.isPanExpanded;
    document.getElementById('acbns').click();
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
    this.isAcctExpanded = !this.isAcctExpanded;
    document.getElementById('acounr').click();
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
    this.isNgoExpanded = !this.isNgoExpanded;
    document.getElementById('bankbn').click();
  }

  bankdetail1() {
    this.isNgoExpanded = !this.isNgoExpanded;
    this.isAcctExpanded = false;
    this.isBusExpanded = false;
    this.isPanExpanded = false;
    this.isPaymentExpanded = false;
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
  }
  allgstFields() {
    if (this.gst) {
      if (this.gstno) {
        return true;
      }
      return false;
    }
    return true;
  }
  setount(res: boolean) {
    this.gst = res;

  }


}
