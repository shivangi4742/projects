import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { SDK } from './../models/sdk.model';
import { CampaignList } from "../models/campaignlist.model";
import { Campaign } from './../models/campaign.model';
import { CampaignSummary } from './../models/campaignsummary.model';
import { Customer } from "../models/customer.model";
import { PrintPayment } from "../models/printpayment.model";
import { Merchant } from "../models/merchant.model";
import { PaymentLinks } from "../models/paymentlinks.model"

import { UtilsService } from './utils.service';

@Injectable()
export class CampaignService {
    tomdd1: string;
    fromdd: string;
    dd2:string;
    private _sdk: SDK;
    private merchant: Merchant;
    private _customer: Customer;
    private _PaymentLinks: PaymentLinks[];
    //activepl: PaymentLinks[];
    //inactive: PaymentLinks[];
    private _urls: any = {
        getCampaignsURL: 'campaign/getCampaigns',
        getCampaignSummaryURL: 'campaign/getCampaignsSummary',
        setCommPrefURL: 'paymentadapter/setCommPref',
        getCommPrefURL: 'paymentadapter/getCommPref',
        getDonorListURL: 'merchant/getDonorList',
        saveCampaignURL: 'campaign/saveCampaign',
        getCampaignURL: 'sdk/getPaymentLinkDetails',
        bulkDonorUploadURL: 'merchant/bulkDonorUpload',
        smsCampaignLinkURL: 'campaign/smsCampaignLink',
        saveCampaignLinkURL: 'campaign/saveCampaignLink',
        sendCampaignLinkURL: 'campaign/sendCampaignLink',
        getCampaignURLURL: 'campaign/getCampaignURL',
        sendEmailURL: 'campaign/sendEmail',
        editCampaignURL: 'campaign/editCampaign',
        getAllNGOTransactionsURL: 'campaign/getAllNGOTransactions',
        fetchMerchantDetails: 'campaign/fetchMerchantDetails',
        getCampaignlinkURL: 'sdk/getmerchantpaymentlink',
    }

    constructor(private http: Http, private utilsService: UtilsService) { }

    setCampaign(sdk: SDK) {
        this._sdk = sdk;
    }

    getCampaign(id: string, mtype: number): Promise<SDK | null> {
        if (!id)
            return Promise.resolve(null);
        else if (this._sdk && this._sdk.id == id)
            return Promise.resolve(this._sdk);
        else {
            return this.http
                .post(this.utilsService.getBaseURL() + this._urls.getCampaignURL,
                JSON.stringify({
                    "campaignId": id
                }),
                { headers: this.utilsService.getHeaders() })
                .toPromise()
                .then(res => this.fillCampaign(res.json(), mtype))
                .catch(res => this.utilsService.returnGenericError());
        }
    }

    fillCampaign(res: any, mtype: number): SDK | null {
        if (res && res.txnrefnumber) {
            let modes: Array<string> = new Array<string>();
            modes.push('UPI');
            let convFee: boolean = false;
            if (res.merchantUser.acceptedPaymentMethods && res.merchantUser.acceptedPaymentMethods.length > 0) {
                convFee = res.merchantUser.chargeConvenienceFee;
                res.merchantUser.acceptedPaymentMethods.forEach(function (m: any) {
                    if (m && m.paymentMethod) {
                        if ((m.paymentMethod == 'CREDIT_CARD' || m.paymentMethod == 'CC') && modes.indexOf('CC') < 0)
                            modes.push('CC');
                        else if ((m.paymentMethod == 'DEBIT_CARD' || m.paymentMethod == 'DC') && modes.indexOf('DC') < 0)
                            modes.push('DC');
                        else if ((m.paymentMethod == 'NET_BANKING' || m.paymentMethod == 'NB') && modes.indexOf('NB') < 0)
                            modes.push('NB');
                        else if ((m.paymentMethod == 'MEAL_COUPON' || m.paymentMethod == 'SODEXO') && modes.indexOf('SODEXO') < 0)
                            modes.push('SODEXO');
                    }
                });
            }

            return new SDK(res.employeeId, res.askempid, res.mndempid, res.companyName, res.askcompname, res.mndcompname, res.askmob, res.askadd, res.mndmob, res.mndpan, res.panaccepted, res.mndname, res.askname, res.askemail, res.mndemail,
                res.mndaddress, false, false, false, res.askresidence, false, false, res.prodMultiselect, false, mtype, res.invoiceAmount, 0, 0,
                res.minpanamnt, mtype, res.totalbudget, res.txnrefnumber, '', res.surl, res.furl, '', res.mobileNumber, res.customerName,
                res.merchantUser ? res.merchantUser.mccCode : '', res.fileUrl, '', '', res.merchantUser ? res.merchantUser.id : '',
                res.expiryDate, (res.merchantUser && res.merchantUser.defaultAcc) ? res.merchantUser.defaultAcc.virtualAddress : '', res.description,
                res.merchantUser ? res.merchantUser.merchantCode : '', res.merchantUser ? res.merchantUser.displayName : '', res.txnrefnumber,
                res.invoiceNumber, res.till, null, null, null, null, null, null, null, null, null, modes, null, null, convFee);
        }

        return null;
    }

    getCampaignSummary(merchantCode: string, fromDate: string, toDate: string): Promise<CampaignSummary> {
        return this.http.post(
            this.utilsService.getBaseURL() + this._urls.getCampaignSummaryURL,
            JSON.stringify({
                "merchantCode": merchantCode,
                "fromDate": fromDate,
                "toDate": toDate
            }),
            { headers: this.utilsService.getHeaders() }
        )
            .toPromise()
            .then(res => this.setCampaignSummary(res.json()))
            .catch(res => this.utilsService.returnGenericError());
    }

    smsCampaignLink(url: string, mtype: number, title: string, campaignName: string, phone: string) {
        return this.http.post(
            this.utilsService.getBaseURL() + this._urls.smsCampaignLinkURL,
            JSON.stringify({
                "url": url,
                "mtype": mtype,
                "title": title,
                "phone": phone,
                "campaignName": campaignName
            }),
            { headers: this.utilsService.getHeaders() }
        )
            .toPromise()
            .then(res => res.json())
            .catch(res => this.utilsService.returnGenericError());
    }

    sendCampaignLink(replace: boolean, mtype: number, hasProds: boolean, merchantCode: string, title: string, phone: string, payLink: string,
        alias: string, campaignName: string, description: string, imageURL: string): Promise<any> {
        return this.http.post(
            this.utilsService.getBaseURL() + this._urls.sendCampaignLinkURL,
            JSON.stringify({
                "merchantCode": merchantCode,
                "mtype": mtype,
                "replace": replace,
                "hasProds": hasProds,
                "title": title,
                "phone": phone,
                "payLink": payLink,
                "campaignName": campaignName,
                "description": description,
                "imageURL": imageURL,
                "alias": alias
            }),
            { headers: this.utilsService.getHeaders() }
        )
            .toPromise()
            .then(res => res.json())
            .catch(res => this.utilsService.returnGenericError());
    }

    saveCampaignLink(replace: boolean, hasProds: boolean, merchantCode: string, payLink: string, alias: string, campaignName: string,
        description: string, imageURL: string, expdt: string, mtype: number): Promise<any> {
        return this.http.post(
            this.utilsService.getBaseURL() + this._urls.saveCampaignLinkURL,
            JSON.stringify({
                "merchantCode": merchantCode,
                "replace": replace,
                "hasProds": hasProds,
                "payLink": payLink,
                "campaignName": campaignName,
                "description": description,
                "imageURL": imageURL,
                "expdt": expdt,
                "alias": alias,
                "mtype": mtype
            }),
            { headers: this.utilsService.getHeaders() }
        )
            .toPromise()
            .then(res => res.json())
            .catch(res => this.utilsService.returnGenericError());
    }

    editCampaign(sdk: SDK): Promise<any> {
        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.editCampaignURL,
            JSON.stringify({
                "sdk": sdk
            }),
            { headers: this.utilsService.getHeaders() })
            .toPromise()
            .then(res => res.json())
            .catch(res => this.utilsService.returnGenericError());
    }

    saveCampaign(sdk: SDK): Promise<any> {
        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.saveCampaignURL,
            JSON.stringify({
                "sdk": sdk
            }),
            { headers: this.utilsService.getHeaders() })
            .toPromise()
            .then(res => res.json())
            .catch(res => this.utilsService.returnGenericError());
    }

    getCampaignURL(merchantCode: string, mtype: number, campaignId: string) {
        return this.http.post(this.utilsService.getBaseURL() + this._urls.getCampaignURLURL,
            JSON.stringify({
                "campaignId": campaignId,
                "merchantCode": merchantCode,
                "mtype": mtype
            }),
            { headers: this.utilsService.getHeaders() })
            .toPromise()
            .then(res => res.json())
            .catch(res => this.utilsService.returnGenericError());
    }

    getCampaigns(merchantCode: string, fromDate: string, toDate: string, sortColumn: string, campaignName: string,
        sortDirection: string, pageNumber: number): Promise<CampaignList> {
        if (campaignName) {
            return this.http.post(
                this.utilsService.getBaseURL() + this._urls.getCampaignsURL,
                JSON.stringify({
                    "merchantCode": merchantCode,
                    "campaignName": campaignName,
                    "sortDirection": sortDirection,
                    "pageNumber": pageNumber
                }),
                { headers: this.utilsService.getHeaders() }
            )
                .toPromise()
                .then(res => this.setCampaignDetails(res.json()))
                .catch(res => this.utilsService.returnGenericError());
        }
        else {
            return this.http.post(
                this.utilsService.getBaseURL() + this._urls.getCampaignsURL,
                JSON.stringify({
                    "merchantCode": merchantCode,
                    "fromDate": fromDate,
                    "toDate": toDate,
                    "sortColumn": sortColumn,
                    "sortDirection": sortDirection,
                    "pageNumber": pageNumber
                }),
                { headers: this.utilsService.getHeaders() }
            )
                .toPromise()
                .then(res => this.setCampaignDetails(res.json()))
                .catch(res => this.utilsService.returnGenericError());
        }
    }

    setCampaignSummary(res: any): CampaignSummary {
        let campaignSummary: CampaignSummary = new CampaignSummary(0, 0, 0, 0);
        if (res && res.data) {
            var obj = res.data;
            var campaignCount = 0;
            var fundRaised = 0;
            var totalContributor = 0;
            var totalCollection = 0;
            if (obj.campaignCount) {
                campaignCount = obj.campaignCount;
            }

            if (obj.fundRaised) {
                fundRaised = obj.fundRaised;
            }

            if (obj.totalContributor) {
                totalContributor = obj.totalContributor;
            }

            if (obj.totalCollection) {
                totalCollection = obj.totalCollection;
            }

            campaignSummary = new CampaignSummary(campaignCount, fundRaised, totalContributor, totalCollection);
        }

        return campaignSummary;
    }

    setCampaignDetails(res: any): CampaignList {
        let allCampaigns: Array<Campaign> = new Array<Campaign>();
        let campaignList: CampaignList;

        if (res) {
            let numPages = res.totalNoOfPages;
            let totalCamps = res.totalElements;

            if (res.getCampaignDetailsResponseVOList && res.getCampaignDetailsResponseVOList.length > 0) {

                res.getCampaignDetailsResponseVOList.forEach(function (r: any) {

                    var totalbudget = 0;
                    var progress = 0;
                    var fundraised = 0;
                    var campaignName = "";
                    var txnrefnumber = "";
                    var expiryDate;
                    var description = "";
                    var creationDate;

                    if (r.txnrefnumber) {
                        txnrefnumber = r.txnrefnumber;
                    }

                    if (r.totalbudget) {
                        totalbudget = r.totalbudget;
                    }

                    if (r.campaignName) {
                        campaignName = r.campaignName;
                    }

                    if (r.expiryDate) {
                        expiryDate = r.expiryDate;
                    }

                    if (r.fundraised) {
                        fundraised = r.fundraised;
                    }

                    if (totalbudget > 0) {
                        progress = r.fundraised / totalbudget;
                    }

                    if (r.description) {
                        description = r.description;
                    }

                    if (r.creationDate) {
                        creationDate = r.creationDate;
                    }

                    allCampaigns.push(new Campaign(txnrefnumber, campaignName, progress, expiryDate, totalbudget, fundraised, description,
                        creationDate, ''));
                });
            }
            campaignList = new CampaignList(allCampaigns, numPages, totalCamps);
        }
        else {
            campaignList = new CampaignList(allCampaigns, 0, 0);
        }
        return campaignList;
    }

    setCommPref(merchantCode: string, communicationType: string, outgoingPort: number, outgoingServer: string, incomingServer: string,
        userName: string, email: string, emailpassword: string, accountType: string, incomingPort: number, securityType: string): Promise<CampaignSummary> {
        return this.http.post(
            this.utilsService.getBaseURL() + this._urls.getsetCommPrefURL,
            JSON.stringify({
                "merchantCode": merchantCode,
                "userName": userName,
                "emailAddress": email,
                "emailPassword": emailpassword,
                "accountType": accountType,
                "incomingServer": incomingServer,
                "outgoingServer": outgoingServer,
                "securityType": securityType,
                "incomingPort": incomingPort,
                "outgoingPort": outgoingPort,
                "sendingAuthentication": true,
                "communicationType": communicationType
            }),
            { headers: this.utilsService.getHeaders() }
        )
            .toPromise()
            .then(res => this.setCommPrefpost(res.json()))
            .catch(res => this.utilsService.returnGenericError());
    }

    setCommPrefpost(res: any) {
        console.log(res);
    }
    getCommPref(merchantCode: string, communicationType: string): Promise<CampaignSummary> {
        return this.http.post(
            this.utilsService.getBaseURL() + this._urls.getCommPrefURL,
            JSON.stringify({
                "merchantCode": merchantCode,
                "communicationType": communicationType
            }),
            { headers: this.utilsService.getHeaders() }
        )
            .toPromise()
            .then(res => this.getCommPrefpost(res.json()))
            .catch(res => this.utilsService.returnGenericError());
    }

    getCommPrefpost(res: any) {
        console.log(res);

    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }

    fetchMerchantDetails(userId: string, id: string): Promise<Merchant> {

        return this.http.post(
            this.utilsService.getBaseURL() + this._urls.fetchMerchantDetails,
            JSON.stringify({
                "userId": userId,
                "sourceId": id,
                "sourceType": "MERCHANT_REG"// hard code
            }),
            { headers: this.utilsService.getHeaders() })
            .toPromise()
            .then(res => this.fillMerchant(res.json()))
            .catch(res => this.utilsService.returnGenericError());
    }

    fillMerchant(res: any): Merchant {
        let dt = res.data;
        let me = this;
        if (dt) {
            this.merchant = new Merchant(dt.address, dt.userId, dt.pinCode, dt.locality, dt.mobileNumber, dt.panNumber, dt.businessName, dt.merchantLogoUrl, dt.ngoCertifdate, dt.ngoCertifnum, dt.auto80GEnabled);
        }
        return me.merchant;
    }

    getAllNGOTransactions(txnRefNumber: any) {
        return this.http.post(
            this.utilsService.getBaseURL() + this._urls.getAllNGOTransactionsURL,
            JSON.stringify({
                "txnRefNumber": txnRefNumber
            }),
            { headers: this.utilsService.getHeaders() }
        )
            .toPromise()
            .then(res => this.fillCertificate(res.json()))
            .catch(res => this.utilsService.returnGenericError());
    }

    private fillCertificate(tres: any) {
        let res = tres.data[0];
        if (!res)
            return this.utilsService.returnGenericError();

        let me: any = this;
        let totalAmount: number = 0;
        let pmnt: PrintPayment = new PrintPayment(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
            null, null, res.paymentLinkRef, null);;
        if (res) {
            if (res.name)
                pmnt.name = res.name;

            if (res.email)
                pmnt.email = res.email;

            if (res.address)
                pmnt.address = res.address;

            if (res.mobileNo)
                pmnt.phone = res.mobileNo;

            if (res.transactionDate) {
                var a = res.transactionDate.split(' ');
                var final = a[0].split('-');
                pmnt.dateAndTime = final[0] + '/' + final[1] + '/' + final[2];
            }

            if (res.paidAmount) {
                pmnt.amount = parseFloat(res.paidAmount);
                totalAmount += pmnt.amount;
            }

            if (res.txnRefNumber) {
                pmnt.transactionid = res.txnRefNumber;

            }
            if (res.paymentMethodType) {
                pmnt.mode = res.paymentMethodType;

            }
        }

        return { "success": true, "printTxns": pmnt };
    }

    sendEmail(email: any, text: string, subject: string, cc: string): Promise<CampaignSummary> {
        return this.http.post(
            this.utilsService.getBaseURL() + this._urls.sendEmailURL,
            JSON.stringify({
                "to": email,
                "text": text,
                "subject": subject,
                "cc": cc,
                "bcc": []
            }),
            { headers: this.utilsService.getHeaders() }
        )
            .toPromise()
            .then(res => res.json())
            .catch(res => this.utilsService.returnGenericError());
    }

    merchantpaymentlink(merchantCode: string, page: number): Promise<any> {
        return this.http.post(
            this.utilsService.getBaseURL() + this._urls.getCampaignlinkURL,
            JSON.stringify({
                "merchantCode": merchantCode,
                "pageNumber": page
            }),
            { headers: this.utilsService.getHeaders() }
        )
            .toPromise()
            .then(res => this.merchantpaymentlinkpost(res.json()))
            .catch(res => this.utilsService.returnGenericError());
    }

    merchantpaymentlinkpost(res: any) {
        let me = this;
        let pt = res.merchantPPVoList;
       
        if (res.responseFromAPI == false) {
            return res.responseFromAPI;
        }
        else if (pt && pt.length > 0) {
            this._PaymentLinks = new Array<PaymentLinks>();
            for (let i: number = 0; i < pt.length; i++) {
                
                if(pt[i].amount){
                   var dd = pt[i].amount;
                }
                if(pt[i].url){
                   this.dd2 = pt[i].url;
                }
                if(pt[i].id){
                   var dd1 = pt[i].id;
                }
                if ((pt[i].description)) {
                    var p = (pt[i].description).substring(0, 30);
                }
                if (pt[i].creationDate) {
                    var crdate = pt[i].creationDate
                    let dta: string[] = crdate.split(' ');
                    let dtf: string[] = dta[0].split('-');
                    this.fromdd = dtf[2] + '-' + dtf[1] + '-' + dtf[0] + ' ' + dta[1];
                }
                 let pp:boolean = true;

                if (pt[i].expiryDate) {
                    var crdate = pt[i].expiryDate
                    let dta1: string[] = crdate.split(' ');
                    let dtf: string[] = dta1[0].split('-');
                    this.tomdd1 = dtf[2] + '-' + dtf[1] + '-' + dtf[0] + ' ' + dta1[1];

                    // console.log('hello2', this.utilsService.getCurDateString());
                        let dta2: string[] = this.tomdd1.split(' ');
                      
                        if (dta2[0] < this.utilsService.getCurDateString()) {
                            pp = false;
                        }
                        me._PaymentLinks.push(new PaymentLinks(p,this.dd2, dd1,
                                this.fromdd , this.tomdd1, dd, pt.fileurl, pp));
                            //console.log(me._PaymentLinks, 'hello');
                }
                else {
                    me._PaymentLinks.push(new PaymentLinks(p, this.dd2, dd1,
                                this.fromdd , this.tomdd1, dd, pt.fileurl, pp));
                            //console.log(me._PaymentLinks, 'hello');
                }                    
                
            }

        }
         return me._PaymentLinks; 

    }
}

 