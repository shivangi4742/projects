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
import { PayRequestModel } from "../models/payrequest.model";

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

  private payRequest: PayRequestModel;

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

  payBill(payPinModel: PayPinModel, totalAmount: number, billAmount: number, paymentMode: string, convenienceFees: number, remarks: string, subLedgerList: PaybillChargesModel[], allSubLedgerList: PaybillChargesModel[]): Promise<PayBillResponseModel> {

    var pgModeObj;

    var pgModeArray = [];
    var upiModeArray = [];

    if (paymentMode == "UPI") {
      upiModeArray = payPinModel.upi_details;
    }
    else if (paymentMode == "NB") {

      var netBankModel = payPinModel.pg_details[0].netbank;
      var pgChargesDetail = new PgChargesDetails(netBankModel, null, null);
      pgModeArray.push(pgChargesDetail);

    }
    else if (paymentMode == "DC") {

      var dcModel = payPinModel.pg_details[0].debitcard;
      var pgChargesDetail = new PgChargesDetails(null, dcModel, null);
      pgModeArray.push(pgChargesDetail);

    }
    else if (paymentMode == "CC") {

      var ccModel = payPinModel.pg_details[0].creditcard;
      var pgChargesDetail = new PgChargesDetails(null, null, ccModel);
      pgModeArray.push(pgChargesDetail);

    }

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
      'ledger_id': payPinModel.ledger_id,
      'society_id': payPinModel.society_id,
      'allsubledger_list': allSubLedgerList,
      'bill_amount': billAmount,
      'payment_gateway_details': pgModeArray,
      'upi_details': upiModeArray,
      'pay_convenience_fees': convenienceFees
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
      this.payPinResponse = new PayPinResponseModel(null, false, JSON.parse(res.data).message); // False hardcoded because the api sometimes returns null value
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

        me.pgChargesDetailArray = new Array();

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

        me.upiChargesDetailArray = new Array();

        payPinDetail.upi_details.forEach(function (upiDetails: any) {
          var netbank = upiDetails.netbank;

          var netBankModel = new PgChargesModel(netbank.category, netbank.charge, netbank.gst_percent);

          var upiChargesDetail = new UpiChargesDetails(netBankModel);
          me.upiChargesDetailArray.push(upiChargesDetail);
        });

        me.subLedgerArray = new Array();

        payPinDetail.subledger_list.forEach(function (subledger: any) {
          var amount = subledger.amount;
          var subledger_code = subledger.subledger_code;
          var type = subledger.type;

          var subLedger = new SubLedgerModel(amount, subledger_code, type, amount);
          me.subLedgerArray.push(subLedger);
        });

        me.allSubLedgerArray = new Array();

        if (payPinDetail.allsubledger_list && payPinDetail.allsubledger_list.length > 0) {
          payPinDetail.allsubledger_list.forEach(function (subledger: any) {
            var amount = subledger.amount;
            var subledger_code = subledger.subledger_code;
            var type = subledger.type;

            var subLedger = new SubLedgerModel(amount, subledger_code, type, amount);
            me.allSubLedgerArray.push(subLedger);
          });
        }

        me.payPinModelArray = new Array();

        var payPinModel = new PayPinModel(me.allSubLedgerArray, billAmount, communityName, contactNumber, dueDate, emailId, flat, payableAmount, firstName, lastName, payPin, me.pgChargesDetailArray, remark, me.subLedgerArray, me.upiChargesDetailArray, payPinDetail.ledger_id, payPinDetail.society_id);
        me.payPinModelArray.push(payPinModel);
      });

      this.benowModel = new BenowModel(me.payPinModelArray);
      this.payPinResponse = new PayPinResponseModel(this.benowModel, res.success, '');
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

  }

  private getTempHeaders(): any {
    let headers: any = {
      'content-type': 'application/json',

    };
    return new Headers(headers);
  }

  setPayRequest(payRequest: PayRequestModel): Promise<void> {
    return this.getHash(payRequest)
      .then(res => this.assignPayRequest(res, payRequest));
  }

  assignPayRequest(hash: string, payRequest: PayRequestModel) {
    this.payRequest = payRequest;
    this.payRequest.hash = hash;
  }

  private getHash(pr: PayRequestModel): Promise<string> {
    let data: any = {
      "amount": pr.amount,
      "email": pr.email,
      "firstName": pr.firstName,
      "failureURL": pr.failureURL,
      "merchantCode": pr.merchantCode,
      "mccCode": pr.mccCode,
      "description": pr.description,
      "successURL": pr.successURL,
      "txnid": pr.txnid,
      "udf1": pr.udf1,
      "udf2": pr.udf2,
      "udf3": pr.udf3,
      "udf4": pr.udf4,
      "udf5": pr.udf5,
      "phone": pr.phone
    };

    let hdrs: any = { 'content-type': 'application/json' };
    var json = JSON.parse(JSON.stringify(data));
    var strToHash = pr.amount
      + "|" + pr.description
      + "|" + pr.email
      + "|" + pr.failureURL
      + "|" + pr.firstName
      + "|" + pr.mccCode
      + "|" + pr.merchantCode
      + "|" + pr.phone
      + "|" + pr.successURL
      + "|" + pr.txnid
      + "|" + pr.udf1
      + "|" + pr.udf2
      + "|" + pr.udf3
      + "|" + pr.udf4
      + "|" + pr.udf5;

    var salt = '';
    if (pr.merchantCode == 'APF03') {
      salt = '[B@6af00024';
    }
    else if (pr.merchantCode == 'ALIO2') {
      salt = '[B@19b076ea';
    }


    var payloadObj: any = {
      "data": JSON.stringify(json),
      "merchantCode": pr.merchantCode,
      "strToHash": strToHash,
      "salt": salt
    };

    return this.http
      .post('/hash',
        payloadObj,
        { headers: hdrs }
      )
      .toPromise()
      .then(res => this.returnHash(res.json()))
      .catch(res => null);
  }

  returnHash(res: any): string {
    return res.hash;
  }

  getPayRequest(): PayRequestModel {
    return this.payRequest;
  }

}
