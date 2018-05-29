import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { Product } from './../models/product.model';
import { Transaction } from '../models/transaction.model';
import { Payment } from "../models/payment.model";

import { UtilsService } from './utils.service';

@Injectable()
export class TransactionService {
    settledate:string;
    startDate:string;
    endDate:string;
    private _selPayment:Payment;
    private _urls: any = {
        getTransactionDetailsURL: 'txn/getTransactionDetails',
        getProductTransactionsURL: 'txn/getProductTransactions',
        getNewProductTransactionsURL: 'txn/getNewProductTransactions',
        getAllProductTransactionsURL: 'txn/getAllProductTransactions'
    }

    constructor(private http: Http, private utilsService: UtilsService) { }

    private getMethodName(m: string): string {
        switch(m){
            case 'CREDIT_CARD':
                return 'Credit Card';
            case 'DEBIT_CARD':
                return 'Debit Card';
            case 'NET_BANKING':
                return 'Net Banking';
            case 'CASH':
                return 'Cash';
            default:
                return m;
        }
    }

    private fillProdTransactions(res: any): Transaction | null{
        let txns: Transaction;
        if(res && res.totalNoOfOrders > 0) {
            txns = new Transaction(res.totalNoOfOrders, res.totalAmount, res.noOfPages, null);
            if(res.orders && res.orders.length > 0) {
                txns.payments = new Array<Payment>();
                for(let i: number = 0; i < res.orders.length; i++) {
                    let hasCashBack: boolean = false;
                    let mode: string | null = null;
                    if(res.orders[i].methodTypes && res.orders[i].methodTypes.length > 0) {
                        for(let k: number = 0; k < res.orders[i].methodTypes.length; k++) {
                            if(res.orders[i].methodTypes[k] && res.orders[i].methodTypes[k].toUpperCase() == 'CASHBACK')
                                hasCashBack = true;
                            else
                                mode = this.getMethodName(res.orders[i].methodTypes[k]);
                        }
                    }

                    let nm: string = res.orders[i].name;
                    if(!nm || nm.trim().length <= 0)
                        nm = res.orders[i].displayName;
                        if (res.orders[i].settlementDate) {
                            this.settledate = this.utilsService.getDateTimeString(new Date(res.orders[i].settlementDate));
                        }
                       
                    txns.payments.push(new Payment(hasCashBack, res.orders[i].amountPaid, null, null, res.orders[i].payHistHdrTxnRefNo,
                        res.orders[i].tr, null, mode, nm, res.orders[i].merchantVPA, res.orders[i].orderDate, null, null, false, null, res.orders[i].email,
                        res.orders[i].mobileNo, res.orders[i].address, res.orders[i].orderDescription, res.orders[i].pincode, 
                        res.orders[i].city, res.orders[i].state,res.orders[i].settledAmount,this.settledate));

                    if(res.orders[i].payerProduct && res.orders[i].payerProduct.length > 0) {
                        txns.payments[i].products = new Array<Product>();
                        txns.payments[i].hasProducts = true;
                        for(let j: number = 0; j < res.orders[i].payerProduct.length; j++){
                            this.startDate = '';
                            this.endDate = '';
                            if (res.orders[i].payerProduct[j].startDate) {
                                var s = this.utilsService.getDateTimeString(new Date(res.orders[i].payerProduct[j].startDate));
                                let s1: any = s.split(' ');
                                let std1: any = s1[0].split('/');
                                this.startDate = std1[0] + '-' + std1[1] + '-' + std1[2];
            
                            }
                            if (res.orders[i].payerProduct[j].endDate) {
                                var e = this.utilsService.getDateTimeString(new Date(res.orders[i].payerProduct[j].endDate));
                                let e1: any = e.split(' ');
                                let e11: any = e1[0].split('/');
                                this.endDate = e11[0] + '-' + e11[1] + '-' + e11[2];
            
                            }
                            
                            txns.payments[i].products!.push(new Product(false, false, false, res.orders[i].payerProduct[j].quantity,
                                res.orders[i].payerProduct[j].price, res.orders[i].payerProduct[j].price, res.orders[i].payerProduct[j].id, null,
                                res.orders[i].payerProduct[j].prodName, res.orders[i].payerProduct[j].prodDescription,                                
                                res.orders[i].payerProduct[j].uom, res.orders[i].payerProduct[j].prodImgUrl, res.orders[i].payerProduct[j].color, 
                                res.orders[i].payerProduct[j].size, res.orders[i].payerProduct[j].productType, null, null, null, 
                                res.orders[i].payerProduct[j].merchantCode, null,res.orders[i].payerProduct[j].shippingCharge, res.orders[i].payerProduct[j].venue, this.startDate,this.endDate, res.orders[i].payerProduct[j].startTime,  res.orders[i].payerProduct[j].endTime));
                            }       
                    }
                    
                }
            }

          
            return txns;
        }
        return null;
    }

    public getNewProductTransactions(merchantCode: string, fromDate: string, toDate: string, page: number, 
        lastTxnId: string): Promise<Transaction|null> {
        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.getNewProductTransactionsURL, 
                JSON.stringify({
                        "merchantCode":merchantCode,
                        "fromDate":fromDate,
                        "toDate":toDate,
                        "pageNumber":page,
                        "sortColumn": "transactionDate",
                        "sortDirection": "DESC",
                        "status": "Successful",
                        "lastTxnId": lastTxnId
                }), 
                { headers: this.utilsService.getHeaders() })
            .toPromise()
            .then(res => this.fillProdTransactions(res.json()))
            .catch(res => null);   
    }

    public getTransactionDetails(merchantCode: string, txnid: string): Promise<any> {
        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.getTransactionDetailsURL, 
                JSON.stringify({
                        "merchantCode": merchantCode,
                        "txnId": txnid
                }), 
                { headers: this.utilsService.getHeaders() })
            .toPromise()
            .then(res => res.json())
            .catch(res => null);           
    }

    public getProductTransactions(merchantCode: string, fromDate: string, toDate: string, page: number): Promise<Transaction|null> {
        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.getProductTransactionsURL, 
                JSON.stringify({
                        "merchantCode":merchantCode,
                        "fromDate":fromDate,
                        "toDate":toDate,
                        "pageNumber":page,
                        "sortColumn": "transactionDate",
                        "sortDirection": "DESC",
                        "status": "Successful"
                }), 
                { headers: this.utilsService.getHeaders() })
            .toPromise()
            .then(res => this.fillProdTransactions(res.json()))
            .catch(res => null);   
    }

    public getAllProductTransactions(merchantCode: string, fromDate: string, toDate: string, page: number): Promise<Transaction|null> {
        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.getAllProductTransactionsURL,
                JSON.stringify({
                    "merchantCode":merchantCode,
                    "fromDate":fromDate,
                    "toDate":toDate,
                    "pageNumber":page,
                    "sortColumn": "transactionDate",
                    "sortDirection": "DESC",
                    "status": "Successful"
                }),
                { headers: this.utilsService.getHeaders() })
            .toPromise()
            .then(res => this.fillProdTransactions(res.json()))
            .catch(res => null);
    }
    
   setSelPayment(p: Payment): Promise<boolean> {
      this._selPayment = p;
        if(p.hasCashback && !p.cbTid)
            return Promise.resolve(false);

        return Promise.resolve(true);
    }

    getSelPayment(): Payment {
        return this._selPayment;
    }
}