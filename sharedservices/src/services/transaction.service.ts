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
        getProductTransactionsURL: 'txn/getProductTransactions'
    }

    constructor(private http: Http, private utilsService: UtilsService) { }

    private fillProdTransactions(res: any): Array<Transaction>|null {
        return null;
    }

    public getProductTransactions(merchantCode: string, fromDate: string, toDate: string, page: number): Promise<Array<Transaction>|null> {
        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.getProductsForTransactionURL, 
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