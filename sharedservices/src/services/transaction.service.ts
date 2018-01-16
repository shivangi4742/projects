import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { Product } from './../models/product.model';
import { Transaction } from './../models/transaction.model';

import { UtilsService } from './utils.service';

@Injectable()
export class TransactionService {
    private _urls: any = {
        getTransactionDetailsURL: 'txn/getTransactionDetails',
        getProductTransactionsURL: 'txn/getProductTransactions',
        getNewProductTransactionsURL: 'txn/getNewProductTransactions'
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

    private fillProdTransactions(res: any): Array<Transaction>|null {
        if(res && res.length > 0) {
            let txns = new Array<Transaction>();
            for(let i: number = 0; i < res.length; i++) {
                let txn = new Transaction(false, res[i].amountPaid, null, null, res[i].payHistHdrTxnRefNo, res[i].tr, null, res[i].displayName,
                    res[i].till, res[i].merchantVPA, this.utilsService.formatDT(res[i].orderDate, '/', true, true, false), null, null, null);
                if(res[i].methodTypes && res[i].methodTypes.length > 0) {
                    if(res[i].methodTypes.length == 1)
                        txn.mode = this.getMethodName(res[i].methodTypes[0]);
                    else {
                        for(let m of res[i].methodTypes) {
                            if(m && m.toUpperCase() == 'CASHBACK')
                                txn.hasCashback = true;
                            else
                                txn.mode = this.getMethodName(m);
                        }
                    }
                }

                if(txn.tr && (txn.tr.trim().toUpperCase() === 'BENOW MERCHANT' || txn.tr.trim().toUpperCase() === 'BENOW 20MERCHANT'))
                    txn.tr = txn.id;

                if(res[i].products && res[i].products.length > 0) {
                    txn.products = new Array<Product>();
                    for(let j: number = 0; j < res[i].products.length; j++) {
                        txn.products.push(new Product(false, false, false, res[i].products[j].quantity, res[i].products[j].price, 
                            res[i].products[j].price, res[i].products[j].id, res[i].products[j].prodName, '', res[i].products[j].uom, ''));
                    }
                }

                txns.push(txn);
            }

            return txns;
        }

        return null;
    }

    public getNewProductTransactions(merchantCode: string, fromDate: string, toDate: string, page: number, 
        lastTxnId: string): Promise<Array<Transaction>|null> {        
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

    public getProductTransactions(merchantCode: string, fromDate: string, toDate: string, page: number): Promise<Array<Transaction>|null> {        
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
}