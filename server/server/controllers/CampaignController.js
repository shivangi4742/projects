var helper = require('./../utils/Helper');
var config = require('./../configs/Config');

var campCont = {    
    getCampaignsSummary: function (req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        this.getCampaignsSummaryPost(req, function (data) {
            res.json(data);
        });
    },

    checkAliasAvailability: function(d, hdrs, cb) {
        var retErr = {
            "success": true,
            "errorCode": "Not able to check availability."
        };

        try {
            if (d && d.merchantCode && d.alias)
                helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/getParameters', 'POST', hdrs),
                    {
                        "paramType": "alias",
                        "paramCode": d.merchantCode + '/' + d.alias
                    }, cb);
            else
                cb(retErr);
        }
        catch (err) {
            cb(retErr);
        }
    },

    saveCampaignLink: function(req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        var me = this;
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body)
                res.json(retErr);
            else {
                var d = req.body;
                if(d.replace)
                    this.saveURL(d, req.headers, res);
                else {
                    this.checkAliasAvailability(d, req.headers, function(adata) {
                        if(adata && adata.desc1) {
                            var lnk = d.mtype == 2 ? (d.hasProds ? '/contribute/' : '/donate/') : (d.hasProds ? '/buy/' : '/pay/');
                            var ps = d.hasProds ? ('/' + d.merchantCode) : '';
                            var fullUrl = config.me + '/ppl' + lnk + d.payLink + ps;
                            if(adata.desc1 === fullUrl)
                                me.saveURL(d, req.headers, res);
                            else
                                res.json({ "success": false, "errorCode": "URL_IN_USE" });
                        }
                        else
                            me.saveURL(d, req.headers, res);
                    });
                }
            }
        }
        catch (err) {
            res.json(retErr);
        }
    },

    sendCampaignLink: function(req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        var me = this;
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body)
                res.json(retErr);
            else {
                var d = req.body;
                if(d.replace)
                    this.saveURLAndSendLink(d, req.headers, res);
                else {
                    this.checkAliasAvailability(d, req.headers, function(adata) {
                        if(adata && adata.desc1) {
                            var lnk = d.mtype == 2 ? (d.hasProds ? '/contribute/' : '/donate/') : (d.hasProds ? '/buy/' : '/pay/');
                            var ps = d.hasProds ? ('/' + d.merchantCode) : '';
                            var fullUrl = config.me + '/ppl' + lnk + d.payLink + ps;
                            if(adata.desc1 === fullUrl)
                                me.saveURLAndSendLink(d, req.headers, res);
                            else
                                res.json({ "success": false, "errorCode": "URL_IN_USE" });
                        }
                        else
                            me.saveURLAndSendLink(d, req.headers, res);
                    });
                }
            }
        }
        catch (err) {
            res.json(retErr);
        }
    },

    saveURL: function(d, hdrs, res) {
        var me = this;
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            var lnk = d.mtype == 2 ? (d.hasProds ? '/contribute/' : '/donate/') : (d.hasProds ? '/buy/' : '/pay/');
            var ps = d.hasProds ? ('/' + d.merchantCode) : '';
            var fullUrl = config.me + '/ppl' + lnk + d.payLink + ps;
            var title = d.campaignName ? d.campaignName : '';
            var description = d.description ? d.description : '';
            var expdt = d.expdt ? d.expdt : '';
            helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/saveParameters', 'POST', hdrs),
                {
                    "paramType": 'alias',
                    "paramCode": d.merchantCode + '/' + d.alias,
                    "desc1": fullUrl,
                    "desc2": title + '|||' + description + '|||' + expdt,
                    "desc3": d.imageURL ? d.imageURL : '',
                    "val1": 0,
                    "val2": 0,
                    "val3": 0
                }, function(udata) {
                    if(udata && udata.desc1)
                        res.json({ "success": true });
                    else
                        res.json(retErr);
                });
        }
        catch (err) {
            res.json(retErr);
        }
    },

    saveURLAndSendLink: function(d, hdrs, res) {
        var me = this;
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            var lnk = d.mtype == 2 ? (d.hasProds ? '/contribute/' : '/donate/') : (d.hasProds ? '/buy/' : '/pay/');
            var ps = d.hasProds ? ('/' + d.merchantCode) : '';
            var fullUrl = config.me + '/ppl' + lnk + d.payLink + ps;
            var title = d.campaignName ? d.campaignName : '';
            var description = d.description ? d.description : '';
            helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/saveParameters', 'POST', hdrs),
                {
                    "paramType": 'alias',
                    "paramCode": d.merchantCode + '/' + d.alias,
                    "desc1": fullUrl,
                    "desc2": title + '|||' + description,
                    "desc3": d.imageURL ? d.imageURL : '',
                    "val1": 0,
                    "val2": 0,
                    "val3": 0
                }, function(udata) {
                    if(udata && udata.desc1) {
                        me.sendCampaignLinkPost(config.me + '/r/' + d.merchantCode + '/' + d.alias, d.mtype, d.title, d.campaignName, d.phone, 
                            hdrs, function(data) {
                            res.json(data);
                        });
                    }
                    else
                        res.json(retErr);
                });
        }
        catch (err) {
            res.json(retErr);
        }
    },

    smsCampaignLink: function(req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        var me = this;
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body)
                res.json(retErr);
            else {
                var d = req.body;
                if(d && d.phone) {
                    this.sendCampaignLinkPost(d.url, d.mtype, d.title, d.campaignName, d.phone, req.headers, function(data) {
                        res.json(data);
                    })
                }
            }
        }
        catch (err) {
            res.json(retErr);
        }
    },

    sendCampaignLinkPost: function (rUrl, mtype, title, campaignName, phone, hdrs, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (mtype == 2)
                helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/sendMerchantSMS?mobileNumber=' + phone + '&message=' +
                    encodeURI('Dear Donor, To contribute to ' + title + ', please click on ' + rUrl),
                    'POST', hdrs), null, cb);
            else
                helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/sendMerchantSMS?mobileNumber=' + phone + '&message=' +
                    encodeURI('Dear Customer, To pay to ' + title + ', please click on ' + rUrl),
                    'POST', hdrs), null, cb);
        }
        catch (err) {
            cb(retErr);
        }
    },

    saveCampaign: function (req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        var me = this;
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body)
                res.json(retErr);
            else {
                var d = req.body;
                if(d && d.sdk) {
                    var hdrs = req.headers;
                    var hasProds = false;
                    if(d.sdk.products && d.sdk.products.length > 0)
                        hasProds = true;

                    this.saveCampaignPost(d.sdk, hdrs, function (data) {
                        res.json(data);
                    }); 
                }
                else
                    res.json(retErr);
            }
        }
        catch (err) {
            res.json(retErr);
        }
    },

    saveCampaignProductsPost: function(merchantCode, products, counter, data, hdrs, cb) {
        if(products && products.length > counter) {
            var me = this;
            helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/saveCampaignProduct',
                'POST', hdrs),
                {
                    "merchantCode": merchantCode,
	                "campaignId": data.id,
	                "txnRefNumber": data.paymentReqNumber,
	                "prodId": products[counter].id,
	                "prodPrice": products[counter].price,
                    "prodDescription": products[counter].description,
                    "prodName":products[counter].name,
                    "uom": products[counter].uom,
	                "prodImgUrl": products[counter].imageURL
                }, function(data2) {
                    me.saveCampaignProductsPost(merchantCode, products, ++counter, data, hdrs, cb);
                }); 
        }
        else
            cb(data);
    },

    saveCampaignPost: function(d, hdrs, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!d)
                cb(retErr);
            else {
                if(d && d.merchantCode) {
                    var expDt = d.expiryDate;
                    if (expDt && expDt.length > 9) {
                        var spExDt = expDt.split('-');
                        if (spExDt && spExDt.length > 2)
                            expDt = spExDt[2] + '-' + spExDt[1] + '-' + spExDt[0];
                    }

                    var me = this;                    
                    helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/portablePaymentRequest', 'POST', hdrs),
                        {	
                            "merchantCode": d.merchantCode,
                            "mtype": d.mtype,
                            "campaignName": d.title,
                            "mobileNumber": d.phone ? d.phone : '',
                            "amount": d.amount,
                            "totalbudget": d.campaignTarget,
                            "description": d.description,
                            "fileURL": d.imageURL,
                            "refNumber": d.invoiceNumber,
                            "till": d.til,
                            "expiryDate": expDt,
                            "askname": d.askname,
                            "askemail": d.askemail,
                            "askmob": d.askmob,
                            "askadd": d.askadd,
                            "mndname": d.mndname,
                            "mndemail": d.mndemail,
                            "mndaddress": d.mndaddress,
                            "mndmob": d.mndmob,
                            "panaccepted": d.askpan,
                            "mndpan": d.mndpan,
                            "minpanamnt": d.minpanamnt,
                            "askresidence": d.askresidence,
                            "prodMultiselect": d.allowMultiSelect
                        }, function(data) {
                            me.saveCampaignProductsPost(d.merchantCode, d.products, 0, data, hdrs, cb);
                        });
                }
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    getCampaignsSummaryPost: function(req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body)
                cb(retErr);
            else {
                var d = req.body;
                if (d && d.merchantCode)
                    helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/getCampaignSummary', 'POST', req.headers),
                        {
                            "merchantCode": d.merchantCode,
                            "fromDate": d.fromDate,
                            "toDate": d.toDate
                        }, cb);
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    getCampaigns: function (req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        this.getCampaignsPost(req, function (data) {
            res.json(data);
        });
    },

    getCampaignsPost: function(req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body)
                cb(retErr);
            else {
                var d = req.body;
                if (d && d.campaignName)
                    helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/getCampaignDetails', 'POST', req.headers),
                        {
                            "campaignName": d.campaignName,
                            "sortDirection": d.sortDirection,
                            "pageNumber": d.pageNumber
                        }, cb);
                else if (d && d.merchantCode)
                    helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/getCampaignDetails', 'POST', req.headers),
                        {
                            "merchantCode": d.merchantCode,
                            "fromDate": d.fromDate,
                            "toDate": d.toDate,
                            "sortColumn": d.sortColumn,
                            "sortDirection": d.sortDirection,
                            "pageNumber": d.pageNumber
                        }, cb);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

   sendEmail: function (req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        this.sendEmailPost(req, function (data) {
            res.json(data);
        });
    },
 
  sendEmailPost: function(req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body)
                cb(retErr);
            else {
                var d = req.body;
                if (d)
                    helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/sendEmailNotification', 'POST', req.headers),
                        {
                            "to": d.to,
                            "text": d.text,
                            "subject": d.subject,
                            "cc": d.cc,
                            "bcc": d.bcc
                        }, cb);
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    }
}

module.exports = campCont;