import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PayPinResponseModel } from "./../models/paypinresponse.model";
import { PayBillResponseModel } from "./../models/paybillresponse.model";
import { BenowModel } from "./../models/benow.model";
import { PayPinModel } from "./../models/paypin.model";
import { PgChargesModel } from "./../models/pgcharges.model";
import { SubLedgerModel } from "./../models/subledger.model";
import { ChargesModel } from "./../models/charges.model";
import { PaybillChargesModel } from "./../models/paybillcharges.model";
import { PayRequestModel } from "./../models/payrequest.model";

import { ZgService } from "./../services/zg.service";
import { forEach } from '@angular/router/src/utils/collection';
import { SubLedgerList } from '../models/subledgerlist.model';
import { window } from 'rxjs/operators/window';

import { MaterializeAction } from 'angular2-materialize';

@Component({
  selector: 'app-prepage',
  templateUrl: './prepage.component.html',
  styleUrls: ['./prepage.component.css']
})

export class PrepageComponent implements OnInit {

  hasPayPin: boolean;
  showprogress: boolean;
  id: string;
  payPin: string;
  enteredPayPin: string;
  remarks: string = "";

  payPinResponse: PayPinResponseModel;
  benowModel: BenowModel;
  payPinModel: PayPinModel;

  netBankingCharges: PgChargesModel;
  ccCharges: PgChargesModel;
  dcCharges: PgChargesModel;
  upiCharges: PgChargesModel;
  selectedCharges: PgChargesModel;
  chargesModel: ChargesModel;
  subLedgerList: SubLedgerModel[];
  allSubLedgerList: SubLedgerModel[] = new Array();;

  upiSelected: boolean = false;
  netBankingSelected: boolean = false;

  paymentMode: string = '';

  totalBillAmount: number = 0;
  totalSubledgerAmount: number = 0;
  payableAmount: number = 0;
  totalAmount: number;
  amountWithoutCharge: number;
  convenienceFee: number = 0;
  totalConvenienceFee: number = 0;
  gst: number = 0;

  modalActions: any = new EventEmitter<string | MaterializeAction>();

  invalidPaypin: boolean = false;

  strFullName: string;
  strEmail: string;
  strMobile: string;
  strAmount: string;
  genericError: string;
  strInvalidName: string;
  strInvalidEmail: string;
  strInvalidMobile: string;
  strInvalidAmount: string;
  strInvalidRemarks: string;
  isFormValid: boolean;

  supportModes: string[];
  surl: string;
  furl: string;

  serverError: boolean = false;
  serverMessage: string;

  constructor(private route: ActivatedRoute,
    private zgService: ZgService,
    private router: Router) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.strInvalidName = '';
    this.strInvalidEmail = '';
    this.strInvalidMobile = '';
    this.strInvalidAmount = '';
    this.strInvalidRemarks = '';
    this.genericError = '';
    this.isFormValid = true;

    if (this.id && this.id.length > 0) {
      this.enteredPayPin = '';
      this.getPayPinValues(this.id);
      this.showprogress = true;
    }
    else {
      this.hasPayPin = false;
      this.showprogress = false;
    }

  }

  onEditClick(): void {
    this.hasPayPin = false;
  }

  setPayPinModel(res: PayPinResponseModel): void {

    if (res.success == false) {
      this.invalidPaypin = true;
      this.serverError = true;
      this.serverMessage = res.message;
    }
    else {
      this.showprogress = false;

      this.enteredPayPin = '';
      this.invalidPaypin = false;
      this.serverError = false;

      this.payPinResponse = res;
      this.payPinModel = this.payPinResponse.benow.payPinDetails[0];
      this.payPin = this.payPinModel.pay_pin;

      if (this.payPin && this.payPin.length > 0) {
        this.hasPayPin = true;
      }

      this.strFullName = this.payPinModel.payee_first_name + ' ' + this.payPinModel.payee_last_name;
      this.strEmail = this.payPinModel.email_id;
      this.strMobile = this.payPinModel.contact_number;
      this.remarks = this.payPinModel.remark;

      // Assign UPI charges
      if (this.payPinModel.upi_details && this.payPinModel.upi_details.length > 0) {
        this.upiCharges = this.payPinModel.upi_details[0].netbank;
      }

      // Assign CC charges
      if (this.payPinModel.pg_details && this.payPinModel.pg_details[0].creditcard) {
        this.ccCharges = this.payPinModel.pg_details[0].creditcard;
      }

      // Assign DC charges
      if (this.payPinModel.pg_details && this.payPinModel.pg_details[0].debitcard) {
        this.dcCharges = this.payPinModel.pg_details[0].debitcard;
      }

      // Assign Netbanking charges
      if (this.payPinModel.pg_details && this.payPinModel.pg_details[0].netbank) {
        this.netBankingCharges = this.payPinModel.pg_details[0].netbank;
      }

      if (this.payPinModel.subledger_list && this.payPinModel.subledger_list.length > 0) {
        this.subLedgerList = this.payPinModel.subledger_list;
      }

      if (this.payPinModel.allsubledger_list && this.payPinModel.allsubledger_list.length > 0) {
        this.allSubLedgerList = this.payPinModel.allsubledger_list;

        this.allSubLedgerList.forEach(obj => {
          this.totalSubledgerAmount += obj.amount;
        })

      }

      this.totalBillAmount = this.payPinModel.bill_amount;
      this.strAmount = this.payPinModel.bill_amount + '';
      this.payableAmount = this.payPinModel.payable_amount;
      this.calculateTotalAmount();
    }

  }

  savePrePage(): void {

    if (this.enteredPayPin && this.enteredPayPin.length > 0) {
      this.getPayPinValues(this.enteredPayPin);
    }
    else {
      var subLedgerList: PaybillChargesModel[] = new Array();
      var allSubLedgerList: PaybillChargesModel[] = new Array();
      this.subLedgerList.forEach(obj => {
        subLedgerList.push(new PaybillChargesModel(obj.amount, obj.type, obj.subledger_code));
      });

      this.allSubLedgerList.forEach(obj => {
        allSubLedgerList.push(new PaybillChargesModel(obj.amount, obj.type, obj.subledger_code));
      });

      this.zgService.payBill(this.payPinModel, +(parseFloat(this.totalAmount + '').toFixed(2)), +(parseFloat(this.strAmount).toFixed(2)), this.paymentMode, +(parseFloat((this.convenienceFee + this.gst) + '').toFixed(2)), this.remarks, subLedgerList, allSubLedgerList)
        .then(res => this.saveChargesAndNavigate(res));
    }

  }

  saveChargesAndNavigate(payBillResponse: PayBillResponseModel): void {
    if (payBillResponse.success) {
      var paymentURL = payBillResponse.benow.paybill[0].benow_url;
      if (paymentURL && paymentURL.length > 0) {
        var payLinkArray = paymentURL.split('/');
        var payLinkID = payLinkArray[payLinkArray.length - 1];

        this.zgService.updateAmount(payLinkID, this.totalAmount.toString())
          .then(res => this.navigateToPayment(res, paymentURL));

      }
      else {
        this.genericError = 'Something went wrong. Please try again after some time';
      }
    }

  }

  navigateToPayment(response: any, redirectURL: string): void {
    if (response && response.data) {
      var fixedPaymentMode = '';
      if (this.paymentMode == "UPI") {
        fixedPaymentMode = '555049'
      }
      else if (this.paymentMode == "NB") {
        fixedPaymentMode = '4e42'
      }
      else if (this.paymentMode == "DC") {
        fixedPaymentMode = '4443'
      }
      else if (this.paymentMode == "CC") {
        fixedPaymentMode = '4343'
      }

      this.supportModes = [this.paymentMode];

      this.surl = '';
      this.furl = '';

      var merchantCode, mccCode, merchantDesc, merchantTitle, merchantVpa, udf1, udf2, udf3, udf4, udf5;

      udf1 = 'Bill';
      udf2 = this.strEmail;
      udf3 = this.strMobile;
      udf4 = '';
      udf5 = this.payPin;

      if (this.payPinModel.society_id == 'S144') { // This is oberoi
        merchantCode = 'APF03';
        mccCode = '5499';
        merchantDesc = 'Payment for ' + this.payPinModel.flat + ', ' + this.payPinModel.community_name + ', by ' + this.strFullName;
        merchantTitle = 'SPLENDOR COMPLEX';
        merchantVpa = 'APF03@idfcbank';
        udf4 = 'Oberoi Splendor Jogeshwari (East) Mumbai 400060 Maharashtra';
      }
      else {
        merchantCode = 'ALIO2';
        mccCode = '5499';
        merchantDesc = 'Payment for ' + this.payPinModel.flat + ', ' + this.payPinModel.community_name + ', by ' + this.strFullName;
        merchantTitle = 'MYAASHIANA MANAGEMENT SERVICES PVT LTD';
        merchantVpa = 'ALIO2@idfcbank';
      }

      // Remove this if else when SDK goes live. This is just for zipgrid to test.
      if (this.payPin === 'SPLDRZA-104F26AB6') { 
        this.zgService.setPayRequest(new PayRequestModel(1, this.totalAmount + '', false, false, true, false, merchantDesc,
          this.strEmail, this.furl, this.strFullName, '', '', '', this.payPin, mccCode, merchantCode, '1', merchantVpa,
          false, false, false, true, '', this.strMobile, false, false, false, true, this.surl, merchantTitle, 'TXN01', udf1,
          udf2, udf3, udf4, udf5, '', this.supportModes))
          .then(res => this.navigate());
      }
      else {
        document.location.href = redirectURL + '/pay/' + fixedPaymentMode + '/' + this.strFullName.replace(' ', '%20'); // Redirect to payment page   
      }

    }
    else {

    }
  }

  navigate() {
    this.router.navigateByUrl('/redirect');
  }

  paymentModeChanged(mode) {
    if (!this.remarks || this.remarks.length <= 0) {
      this.strInvalidRemarks = 'Remarks cannot be blank';
    }
    this.paymentMode = mode;
    this.selectedCharges = this.getChargesModel(this.paymentMode);
    this.calculateTotalAmount();
  }

  getChargesModel(paymentMode: string): PgChargesModel {
    if (paymentMode == "UPI") {
      return this.upiCharges;
    }
    else if (paymentMode == "NB") {
      return this.netBankingCharges;
    }
    else if (paymentMode == "DC") {
      return this.dcCharges;
    }
    else if (paymentMode == "CC") {
      return this.ccCharges;
    }
    else {
      return null;
    }
  }

  getPayPinValues(payPin: string) {
    this.zgService.getPayPinResponse(payPin)
      .then(res => this.setPayPinModel(res));
  }

  onEnterPayPin(payPin: string) {
    this.invalidPaypin = false;
    this.enteredPayPin = payPin;
  }

  onEnterRemarks(remark: string) {
    if (remark && remark.length > 0) {
      this.strInvalidRemarks = '';
    }
    else {
      this.strInvalidRemarks = 'Remarks cannot be blank';
    }

    this.remarks = remark;
  }

  onEnterPayment(amount: string, position: number) {
    this.strAmount = amount;

    // if(index) 
    this.strInvalidAmount = '';
    this.totalBillAmount = +amount;
    if (this.validateAmount(amount)) {
      // var subledgerObj: SubLedgerModel;
      // var billAmount: number = 0;
      // subledgerObj = this.subLedgerList[position];
      // subledgerObj.amount = +amount;

      // this.subLedgerList.forEach((obj, index) => {
      //   billAmount += obj.amount;
      // })
      // this.totalBillAmount = billAmount;
      // this.payableAmount = +amount;

      this.totalBillAmount = +amount;
      this.calculateTotalAmount();
    }
  }

  onEnterSubLedger(amount: string, position: number) {
    // if(index)

    var subledgerObj: SubLedgerModel;
    var billAmount: number = 0;
    subledgerObj = this.allSubLedgerList[position];
    subledgerObj.amount = +amount;

    this.allSubLedgerList.forEach((obj, index) => {
      billAmount += obj.amount;
    })
    this.totalSubledgerAmount = billAmount;
    // this.payableAmount = +amount; 
    this.calculateTotalAmount();
  }

  calculateTotalAmount() {
    // this.amountWithoutCharge = this.totalBillAmount + this.totalSubledgerAmount;
    this.amountWithoutCharge = this.totalBillAmount;
    this.calculateConvenienceFee();
    // this.totalAmount = this.totalBillAmount + this.totalSubledgerAmount + this.totalConvenienceFee; 
    this.totalAmount = this.totalBillAmount + this.totalConvenienceFee;
  }

  calculateConvenienceFee() {
    if (this.selectedCharges) {
      if (this.selectedCharges.category == "PERCENT") {
        this.convenienceFee = (this.amountWithoutCharge * +this.selectedCharges.charge) / 100;
      }
      else if (this.selectedCharges.category == "FLAT") {
        this.convenienceFee = +this.selectedCharges.charge;
      }
      this.gst = (this.convenienceFee * +this.selectedCharges.gst_percent) / 100; //GST calculation
      this.totalConvenienceFee = this.convenienceFee + this.gst;
    }
  }

  hasAllRequiredFields() {
    return this.paymentMode && this.remarks && this.totalAmount <= 1000000 && this.totalAmount >= 1 && this.validateForm() && this.totalBillAmount > 0 && this.isFormValid;
  }

  validateForm(): boolean {
    var me = this;

    if (this.validateName(this.strFullName)) {
      this.payPinModel.payee_first_name = this.strFullName.split(' ')[0];
      this.payPinModel.payee_last_name = this.strFullName.split(' ')[1];

      if (me.strEmail.indexOf(',') > 0) {
        var emailArray = me.strEmail.split(',');
        var keepGoing = true;
        emailArray.forEach((email, index) => {
          if (keepGoing) {
            if (me.validateEmail(email.trim())) {
              if (index == (emailArray.length - 1)) {
                keepGoing = false;
                this.isFormValid = true;
              }
            }
            else {
              keepGoing = false;
              this.isFormValid = false;
              return false;
            }
          }
        });
        if (this.isFormValid) {
          this.payPinModel.email_id = this.strEmail;
          return true;
        }
        else {
          return false;
        }
      }
      else {
        if (me.validateEmail(this.strEmail)) {
          this.payPinModel.email_id = this.strEmail;
          return me.validatePhoneForm();
        }
        else {
          return false;
        }
      }

    }
    else {
      return false;
    }

  }

  validatePhoneForm(): boolean {
    var me = this;
    if (this.strMobile.indexOf(',') > 0) {
      var mobArray = this.strMobile.split(',');
      var keepGoing = true;
      mobArray.forEach((mob, index) => {
        if (keepGoing) {
          if (me.validateMobile(mob.trim())) {
            if (index == (mobArray.length - 1)) {
              keepGoing = false;
              this.isFormValid = true;
            }
          }
          else {
            keepGoing = false;
            this.isFormValid = false;
            return false;
          }
        }
      });
      if (this.isFormValid) {
        this.payPinModel.contact_number = this.strMobile;
        return true;
      }
      else {
        return false;
      }
    }
    else {
      if (me.validateMobile(this.strMobile)) {
        this.payPinModel.contact_number = this.strMobile;
        return true;
      }
      else {
        return false;
      }
    }
  }

  validateAmount(strAmount: string): boolean {

    if (strAmount) {
      var numStr = /^-?(\d+\.?\d*)$|(\d*\.?\d+)$/;
      if (numStr.test(strAmount)) {
        var amt = +strAmount;
        if (amt > 0) {
          return true;
        }
        else {
          this.strInvalidAmount = 'Amount should be more than zero';
          return false;
        }
      }
      else {
        this.strInvalidAmount = 'Amount can only contain numbers';
        return false;
      }
    }
    else {
      this.strInvalidAmount = 'Amount cannot be blank';
      return false;
    }

    // return true;
  }

  validateName(strName: string): boolean {

    var nameArray = strName.split(' ');

    if (nameArray.length <= 1 || nameArray[1].length < 1) {
      this.strInvalidName = 'Please enter full name';
      return false;
    }
    return true;

  }

  validateEmail(strEmail: string): boolean {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!strEmail || !re.test(strEmail)) {
      this.strInvalidEmail = "Enter valid Email id";
      return false;
    }
    return true;
  }

  validateMobile(strMobile: string): boolean {
    var pattern = /^\d+$/;
    if (!strMobile || strMobile.length != 10 || !pattern.test(strMobile)) {
      this.strInvalidMobile = "Enter valid number";
      return false;
    }

    return true;

  }

  onTaxClck() {
    this.modalActions.emit({ action: "modal", params: ['open'] });
  }

  closeModal() {
    this.modalActions.emit({ action: "modal", params: ['close'] });
  }

  onEnterName(strName: string) {
    this.strInvalidName = "";
    this.isFormValid = this.validateName(strName);
  }

  onEnterEmail(strEmail: string) {
    this.strInvalidEmail = "";
    if (strEmail.indexOf(',') > 0) {
      var emailArray = strEmail.split(',');
      emailArray.forEach(email => {
        this.isFormValid = this.validateEmail(email.trim());
      })
    }
    else {
      this.isFormValid = this.validateEmail(strEmail);
    }
  }

  onEnterMobile(strMobile: string) {
    this.strInvalidMobile = "";
    if (strMobile.indexOf(',') > 0) {
      var mobArray = strMobile.split(',');
      mobArray.forEach(mob => {
        this.isFormValid = this.validateMobile(mob.trim());
      });
    }
    else {
      this.isFormValid = this.validateMobile(strMobile);
    }

  }

}
