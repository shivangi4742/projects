import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { SDK } from './../models/sdk.model';
import { Campaign } from './../models/campaign.model';
import { CampaignSummary } from './../models/campaignsummary.model';

import { UtilsService } from './utils.service';

@Injectable()
export class CampaignService {
    private _urls: any = {
        getCampaignsURL: 'campaign/getCampaigns',
        getCampaignSummaryURL: 'campaign/getCampaignsSummary',
        setCommPrefURL: 'paymentadapter/setCommPref',
        getCommPrefURL: 'paymentadapter/getCommPref',
        getDonorListURL: 'merchant/getDonorList',
        saveCampaignURL: 'campaign/saveCampaign',
        bulkDonorUploadURL: 'merchant/bulkDonorUpload',
        sendCampaignLinkURL: 'campaign/sendCampaignLink'
    }

    constructor(private http: Http, private utilsService: UtilsService) { }

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

    getCampaigns(merchantCode: string, fromDate: string, toDate: string): Promise<Campaign[]> {
        return this.http.post(
            this.utilsService.getBaseURL() + this._urls.getCampaignsURL,
            JSON.stringify({
                "merchantCode": merchantCode,
                "fromDate": fromDate,
                "toDate": toDate
            }),
            { headers: this.utilsService.getHeaders() }
        )
            .toPromise()
            .then(res => this.setCampaignDetails(res.json()))
            .catch(res => this.utilsService.returnGenericError());
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

    setCampaignDetails(res: any): Campaign[] {
        var campaignList = new Array<Campaign>();

        if (res && res.data && res.data.length > 0) {
            res.data.forEach(function (r: any) {

                var totalbudget = 0;
                var progress = 0;
                var fundraised = 0;
                var campaignName = "";
                var expiryDate = "";

                if (r.totalbudget) {
                    totalbudget = r.totalbudget;
                }

                if (r.campaignName) {
                    campaignName = r.campaignName;
                }

                if (r.expiryDate) {
                    expiryDate = r.expiryDate;
                    // expiryDate = "27-02-2018 13:20:00";
                    var dateTime: string[] = expiryDate.split(' ');
                    var date: string = dateTime[0];
                    var time: string = dateTime[1];

                    /** Code to convert expiryDate from 28-07-2017 05:30:00 to 2017/07/28 05:30:00 begins here*/
                    var dateArray: string[] = date.split('-');
                    var day = dateArray[0];
                    var month = dateArray[1];
                    var year = dateArray[2];
                    var updatedDate = year + '/' + month + '/' + day + " " + time;
                    /** Ends here */

                    var currentDate: any = new Date();
                    // var dateString = "28-07-2017 05:30:00";
                    // var dateString = updatedDate.replace(/-/g, "/");
                    var expDate: any = new Date(updatedDate);
                    var diffDate = expDate - currentDate; // diffDate is in milliseconds

                    // console.log('exp date', expDate);
                    // console.log('current date', currentDate);

                    // var seconds = diffDate / 1000;
                    // var minutes = seconds / 60;
                    // var hours = minutes / 60;

                    var days = diffDate / 86400000; // 86400000 is multiplication of 24*60*60*1000
                    var moduloDays = diffDate % 86400000;
                    // console.log('days', days);
                    var hours = moduloDays / 3600000;
                    var moduloHours = moduloDays % 3600000;
                    // console.log('hours', hours);
                    var minutes = moduloHours / 60000;
                    // console.log('minutes', minutes);
                    if (parseFloat(days.toString()) < 0) {
                        expiryDate = "COMPLETED";
                    }
                    else if (parseInt(days.toString()) >= 0) {
                        if (parseInt(days.toString()) > 0) {
                            expiryDate = parseInt(days.toString()) + " Days " + parseInt(hours.toString()) + " Hours " + parseInt(minutes.toString()) + " minutes ";
                        }
                        else if (parseInt(hours.toString()) >= 0) {
                            if (parseInt(hours.toString()) > 0) {
                                expiryDate = parseInt(hours.toString()) + " Hours " + parseInt(minutes.toString()) + " minutes ";
                            }
                            else {
                                expiryDate = parseInt(minutes.toString()) + " minutes ";
                            }
                        }
                    }
                    else {
                        expiryDate = parseInt(days.toString()) + " Days " + parseInt(hours.toString()) + " Hours " + parseInt(minutes.toString()) + " minutes ";
                    }

                }

                if (r.fundraised) {
                    fundraised = r.fundraised;
                }

                if (totalbudget > 0) {
                    progress = r.fundraised / totalbudget;
                }

                campaignList.push(new Campaign(campaignName, progress, expiryDate, totalbudget, fundraised));
            });
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
    getCommPref(merchantCode: string,communicationType:string): Promise<CampaignSummary> {
        return this.http.post(
            this.utilsService.getBaseURL() + this._urls.getCommPrefURL,
            JSON.stringify({
                "merchantCode": merchantCode,
                "communicationType":communicationType
            }),
            { headers: this.utilsService.getHeaders() }
        )
            .toPromise()
            .then(res => this.getCommPrefpost(res.json()))
            .catch(res => this.utilsService.returnGenericError());
    }
    
    getCommPrefpost(res:any) {
        console.log(res);

    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}