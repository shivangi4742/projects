import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Payrequestmodel } from '../models/payrequestmodel';
import 'rxjs/add/operator/toPromise';
@Injectable()
export class PayrequestService {

private payRequest: Payrequestmodel;
    constructor(private http: Http) { }

    getPayRequest(): Payrequestmodel {
        return this.payRequest;
    }

    setPayRequest(payRequest: Payrequestmodel): Promise<void> {
        return this.getHash(payRequest)
            .then(res => this.assignPayRequest(res, payRequest));
    }

    assignPayRequest(hash: string, payRequest: Payrequestmodel) {
        this.payRequest = payRequest;
        this.payRequest.hash = hash;
    }

    returnHash(res: any): string {
        return res.hash;
    }

    private getHash(pr: Payrequestmodel): Promise<string> {
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
        // var jsonData = JSON.parse(JSON.parse(data));
        // console.log('jsonData', jsonData);
        var json = JSON.parse(JSON.stringify(data));
        // let stringToHash = json + pr.merchantCode + 'abcd';
        // console.log('stringToHash', stringToHash);
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

        var payloadObj: any = {
            "data": JSON.stringify(json),
            "merchantCode": pr.merchantCode,
            "salt": "abcd",
            "strToHash": strToHash
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
}
