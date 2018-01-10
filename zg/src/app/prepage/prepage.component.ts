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
  allSubLedgerList: SubLedgerModel[];

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

  constructor(private route: ActivatedRoute,
    private zgService: ZgService,
    private router: Router) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    if (this.id && this.id.length > 0) {
      this.enteredPayPin = '';
      this.getPayPinValues(this.id);
    }
    else {
      this.hasPayPin = false;
    }

  }

  onEditClick(): void {
    this.hasPayPin = false;
  }

  setPayPinModel(res: PayPinResponseModel): void {

    if (res.success == false) {
      this.invalidPaypin = true;
    }
    else {
      this.enteredPayPin = '';
      this.invalidPaypin = false;

      this.payPinResponse = res;
      this.payPinModel = this.payPinResponse.benow.payPinDetails[0];
      this.payPin = this.payPinModel.pay_pin;

      if (this.payPin && this.payPin.length > 0) {
        this.hasPayPin = true;
      }

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
      this.subLedgerList.forEach(obj => {
        subLedgerList.push(new PaybillChargesModel(obj.amount, obj.type, obj.subledger_code));
      });

      this.allSubLedgerList.forEach(obj => {
        subLedgerList.push(new PaybillChargesModel(obj.amount, obj.type, obj.subledger_code));
      });

      this.zgService.payBill(this.payPinModel, this.totalAmount, this.remarks, subLedgerList)
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
        // this.chargesModel = new ChargesModel(payLinkID, this.upiCharges, this.dcCharges, this.ccCharges, this.netBankingCharges, null);
        // this.zgService.setCharges(this.chargesModel);
        // this.zgService.saveCharges(this.payPin, this.chargesModel, 'APF03', payLinkID)
        //   .then(res => console.log('Client res', res));

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

      document.location.href = redirectURL + '/pay/' + fixedPaymentMode; // Redirect to payment page
    }
    else {

    }
  }

  paymentModeChanged(mode) {
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
    this.remarks = remark;
  }

  onEnterPayment(amount: string, position: number) {
    // if(index)

    var subledgerObj: SubLedgerModel;
    var billAmount: number = 0;
    subledgerObj = this.subLedgerList[position];
    subledgerObj.amount = +amount;

    this.subLedgerList.forEach((obj, index) => {
      billAmount += obj.amount;
    })
    this.totalBillAmount = billAmount;
    // this.payableAmount = +amount;
    this.calculateTotalAmount();
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
    this.amountWithoutCharge = this.totalBillAmount + this.totalSubledgerAmount;
    this.calculateConvenienceFee();
    this.totalAmount = this.totalBillAmount + this.totalSubledgerAmount + this.totalConvenienceFee;
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
    return this.paymentMode && this.remarks && this.totalAmount <= 1000000;
  }

  onTaxClck() {
    this.modalActions.emit({ action: "modal", params: ['open'] });
  }

  closeModal() {
    this.modalActions.emit({ action: "modal", params: ['close'] });
  }

}
