import { Injectable } from '@angular/core';
import { Headers, Response, Http } from '@angular/http';

import { UtilsService } from 'benowservices';

import { PayPinResponseModel } from "./../models/paypinresponse.model";
import { BenowModel } from "./../models/benow.model";
import { PayPinDetailsModel } from "./../models/paypindetails.model";
import { PayPinModel } from "./../models/paypin.model";
import { PgChargesModel } from "./../models/pgcharges.model";
import { PgChargesList } from '../models/pgchageslist.model';
import { PgChargesDetails } from "./../models/pgchargesdetail.model";
import { UpiChargesDetails } from "./../models/upichargesdetails.model";
import { SubLedgerModel } from "./../models/subledger.model";
import { SubLedgerList } from "./../models/subledgerlist.model";
import { ChargesModel } from "./../models/charges.model";
import { PaybillChargesModel } from "./../models/paybillcharges.model";
import { PayBillResponseModel } from '../models/paybillresponse.model';
import { PayBillBenow } from '../models/paybillbenow.model';
import { PayBill } from '../models/paybill.model';

@Injectable()
export class ZgService {

  private payPinResponse: PayPinResponseModel;
  private payBillResponse: PayBillResponseModel;
  private payBillBenow: PayBillBenow;
  private benowModel: BenowModel;
  private payPinDetails: PayPinDetailsModel;
  private payPinModelArray: PayPinModel[] = new Array();
  private pgChargesDetailArray: PgChargesDetails[] = new Array();
  private upiChargesDetailArray: UpiChargesDetails[] = new Array();
  private payBillArray: PayBill[] = new Array();
  private subLedgerArray: SubLedgerModel[] = new Array();
  private allSubLedgerArray: SubLedgerModel[] = new Array();
  private pgChargesList: PgChargesList;
  private chargesModel: ChargesModel;

  private _urls: any = {
    'getPayPinDetailsURL': 'zgsvc/getPayPinDetails',
    'paytobillURL': 'zgsvc/paytobill',
    'saveChargesURL': 'zgsvc/saveCharges',
    'updateAmountURL': 'zgsvc/updateAmount'
  }

  constructor(private http: Http, private utilsService: UtilsService) { }

  getPayPinResponse(paypin: string): Promise<PayPinResponseModel> {
    return this.http.post(
      this.utilsService.getBaseURL() + this._urls.getPayPinDetailsURL,
      {
        paypin: paypin
      })
      .toPromise()
      .then(res => this.setPayPinResponse(res.json()))
      .catch(res => this.utilsService.returnGenericError());
  }

  payBill(payPinModel: PayPinModel, totalAmount: number, remarks: string, subLedgerList: PaybillChargesModel[]): Promise<PayBillResponseModel> {

    var reqData = {
      'pay_pin': payPinModel.pay_pin,
      'community_name': payPinModel.community_name,
      'payee_first_name': payPinModel.payee_first_name,
      'payee_last_name': payPinModel.payee_last_name,
      'payable_amount': totalAmount,
      'remark': remarks,
      'due_date': payPinModel.due_date,
      'contact_number': payPinModel.contact_number,
      'flat': payPinModel.flat,
      'email_id': payPinModel.email_id,
      'subledger_list': subLedgerList,
    };

    return this.http.post(
      this.utilsService.getBaseURL() + this._urls.paytobillURL,
      {
        data: reqData
      })
      .toPromise()
      .then(res => this.setPayBillResponse(res.json()))
      .catch(res => this.utilsService.returnGenericError());
  }

  setPayBillResponse(res: any): PayBillResponseModel {
    var me = this;
    res.data.benow.paybill.forEach(function (payBill: any) {

      var payPin = payBill.pay_pin;
      var benowUrl = payBill.benow_url;

      var payBillObj = new PayBill(benowUrl, payPin);
      me.payBillArray.push(payBillObj);

    });

    me.payBillBenow = new PayBillBenow(me.payBillArray);
    me.payBillResponse = new PayBillResponseModel(me.payBillBenow, res.data.success);

    return this.payBillResponse;
  }

  setPayPinResponse(res: any): PayPinResponseModel {
    var me = this;
    if (!JSON.parse(res.data).success) {
      this.payPinResponse = new PayPinResponseModel(null, false); // False hardcoded because the api sometimes returns null value
    }
    else {
      JSON.parse(res.data).benow.payPinDetails.forEach(function (payPinDetail: any) {
        var billAmount = payPinDetail.bill_amount;
        var communityName = payPinDetail.community_name;
        var contactNumber = payPinDetail.contact_number;
        var dueDate = payPinDetail.due_date;
        var emailId = payPinDetail.email_id;
        var flat = payPinDetail.flat;
        var payableAmount = payPinDetail.payable_amount;
        var firstName = payPinDetail.payee_first_name;
        var lastName = payPinDetail.payee_last_name;
        var payPin = payPinDetail.pay_pin;
        var remark = payPinDetail.remark;

        payPinDetail.payment_gateway_details.forEach(function (pgDetails: any) {
          var netbank = pgDetails.netbank;
          var creditCard = pgDetails.creditcard;
          var debitCard = pgDetails.debitcard;

          var netBankModel = new PgChargesModel(netbank.category, netbank.charge, netbank.gst_percent);
          var ccModel = new PgChargesModel(creditCard.category, creditCard.charge, creditCard.gst_percent);
          var dcModel = new PgChargesModel(debitCard.category, debitCard.charge, debitCard.gst_percent);

          var pgChargesDetail = new PgChargesDetails(netBankModel, dcModel, ccModel);
          me.pgChargesDetailArray.push(pgChargesDetail);
        });

        payPinDetail.upi_details.forEach(function (upiDetails: any) {
          var netbank = upiDetails.netbank;

          var netBankModel = new PgChargesModel(netbank.category, netbank.charge, netbank.gst_percent);

          var upiChargesDetail = new UpiChargesDetails(netBankModel);
          me.upiChargesDetailArray.push(upiChargesDetail);
        });

        payPinDetail.subledger_list.forEach(function (subledger: any) {
          var amount = subledger.amount;
          var subledger_code = subledger.subledger_code;
          var type = subledger.type;

          var subLedger = new SubLedgerModel(amount, subledger_code, type, amount);
          me.subLedgerArray.push(subLedger);
        });

        payPinDetail.allsubledger_list.forEach(function (subledger: any) {
          var amount = subledger.amount;
          var subledger_code = subledger.subledger_code;
          var type = subledger.type;

          var subLedger = new SubLedgerModel(amount, subledger_code, type, amount);
          me.allSubLedgerArray.push(subLedger);
        });

        var payPinModel = new PayPinModel(me.allSubLedgerArray, billAmount, communityName, contactNumber, dueDate, emailId, flat, payableAmount, firstName, lastName, payPin, me.pgChargesDetailArray, remark, me.subLedgerArray, me.upiChargesDetailArray);
        me.payPinModelArray.push(payPinModel);
      });

      this.benowModel = new BenowModel(me.payPinModelArray);
      this.payPinResponse = new PayPinResponseModel(this.benowModel, res.success);
    }

    return this.payPinResponse;
  }

  setCharges(chargesModel: ChargesModel) {
    this.chargesModel = chargesModel;
  }

  getCharges(): ChargesModel {
    return this.chargesModel;
  }

  updateAmount(paylinkId: string, amount: string): Promise<any> {
    return this.http.post(
      this.utilsService.getBaseURL() + this._urls.updateAmountURL,
      JSON.stringify({
        "payLinkId": paylinkId,
        "amount": amount
      }),
      { headers: this.getTempHeaders() })
      .toPromise()
      .then(res => res.json())
      .catch(res => this.utilsService.returnGenericError());
  }

  saveCharges(payPinId: string, chargesModel: ChargesModel,
    merchantCode: string, payLinkId: string): Promise<any> {
    console.log(JSON.stringify(chargesModel));
    return this.http.post(
      this.utilsService.getBaseURL() + this._urls.saveChargesURL,
      JSON.stringify({
        "transactionRef": payPinId,
        "actionData": JSON.stringify(chargesModel),
        "tag1": merchantCode,
        "tag2": "",
        "tag3": payLinkId,
        "val1": "",
        "val2": "",
        "val3": ""
      }),
      { headers: this.getTempHeaders() })
      .toPromise()
      .then(res => this.afterChargesSave(res))
      .catch(res => this.utilsService.returnGenericError());
  }

  afterChargesSave(res: any): void {
    console.log('response', res);
  }

  private getTempHeaders(): any {
    let headers: any = {
      'content-type': 'application/json',

    };
    return new Headers(headers);
  }

}
