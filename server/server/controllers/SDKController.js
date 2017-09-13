var crypto = require('crypto');

var helper = require('./../utils/Helper');
var config = require('./../configs/Config');

var sdkCont = {    
    getHash: function (req, res) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };
        res.setHeader("X-Frame-Options", "DENY");
        if(req && req.body && req.body.merchantCode && req.body.mccCode && req.body.txnid && req.body.amount > 0) {
            var data = {
                "amount": req.body.amount,
                "email": req.body.email ? req.body.email : '',
                "firstName": req.body.firstName ? req.body.firstName : '',
                "failureURL": req.body.failureURL ? req.body.failureURL : '',
                "merchantCode": req.body.merchantCode,
                "mccCode": req.body.mccCode,
                "description": req.body.description ? req.body.description : '',
                "successURL": req.body.successURL ? req.body.successURL : '',
                "txnid": req.body.txnid,
                "udf1": '',
                "udf2": '',
                "udf3": '',
                "udf4": '',
                "udf5": '',
                "phone": req.body.phone
            };
            var strToHash = data.amount
                + "|" + data.description
                + "|" + data.email
                + "|" + data.failureURL
                + "|" + data.firstName
                + "|" + data.mccCode
                + "|" + data.merchantCode
                + "|" + data.phone
                + "|" + data.successURL
                + "|" + data.txnid
                + "|" + data.udf1
                + "|" + data.udf2
                + "|" + data.udf3
                + "|" + data.udf4
                + "|" + data.udf5;
                console.log(strToHash);
            var hashData = crypto.createHash('md5').update(config.sdkSalt).update(strToHash + data.merchantCode + config.sdkSalt).digest('hex');
            res.send({ "hash": hashData });
        }
        else
            res.json(retErr);
    },

    getPaymentLinkDetails: function (req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        this.getPaymentLinkDetailsPost(req, function (data) {
            res.json(data);
        });  
    },

    getPaymentLinkDetailsPost: function(req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body)
                cb(retErr);
            else {
                var d = req.body;
                if (d && d.campaignId) 
                    helper.getAndCallback(
                        helper.getDefaultExtServerOptions('/payments/paymentadapter/getPortablePaymentRequest?txnRef=' + d.campaignId, 
                            'GET', req.headers), cb, false);
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    smsPaymentLinkPost: function (hasProds, merchantCode, name, merchant, mtype, phone, txnId, hdrs, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        var sfix = '';
        var link = '/pay/';
        if(hasProds) {
            link = '/buy/';
            sfix = '/' + merchantCode;
        }

        try {
            if (mtype == 2) {
                if (!name)
                    name = 'Donor';

                helper.postAndCallback(helper.getExtServerOptions('/merchants/merchant/sendMerchantSMS?mobileNumber=' + phone + '&message=' +
                    encodeURI('Dear Donor, To contribute for ' + merchant + ', please click on ' + config.me + '/ppl' + link + txnId + sfix),
                    'POST', hdrs), null, cb);
            }
            else {
                if (!name)
                    name = 'Customer';

                helper.postAndCallback(helper.getExtServerOptions('/merchants/merchant/sendMerchantSMS?mobileNumber=' + phone + '&message=' +
                    encodeURI('Dear Customer, To pay ' + merchant + ', please click on ' + config.me + '/ppl' + link + txnId + sfix),
                    'POST', hdrs), null, cb);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    savePaymentLinkDetails: function (req, res) {
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

                    this.savePaymentLinkDetailsPost(d.sdk, hdrs, function (data) {
                        if (data && data.paymentReqNumber && data.mobileNumber) {
                            me.smsPaymentLinkPost(hasProds, d.sdk.merchantCode, data.customerName, 
                                d.sdk.title, d.sdk.mtype, data.mobileNumber, 
                                data.paymentReqNumber, hdrs, function (out) {
                                if (out === true) {
                                    res.setHeader("X-Frame-Options", "DENY");
                                    res.json({ success: true });
                                }
                                else {
                                    res.setHeader("X-Frame-Options", "DENY");
                                    res.json({ success: false, errorMsg: 'Error in sending payment link. Please try again.' });
                                }
                            });
                        }
                        else {
                            res.setHeader("X-Frame-Options", "DENY");
                            res.json({ success: false, errorMsg: 'Error in saving payment link. Please try again.' });
                        }
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

    savePaymentLinkProductsPost: function(merchantCode, products, counter, data, hdrs, cb) {
        if(products && products.length > counter) {
            var me = this;
            helper.postAndCallback(helper.getExtServerOptions('/payments/paymentadapter/saveCampaignProduct',
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
                    me.savePaymentLinkProductsPost(merchantCode, products, ++counter, data, hdrs, cb);
                }); 
        }
        else
            cb(data);
    },

    savePaymentLinkDetailsPost: function(d, hdrs, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!d)
                cb(retErr);
            else {
                if(d && d.phone && d.merchantCode) {
                    var expDt = d.expiryDate;
                    if (expDt && expDt.length > 9) {
                        var spExDt = expDt.split('-');
                        if (spExDt && spExDt.length > 2)
                            expDt = spExDt[2] + '-' + spExDt[1] + '-' + spExDt[0];
                    }

                    var me = this;                    
                    helper.postAndCallback(helper.getExtServerOptions('/payments/paymentadapter/portablePaymentRequest', 'POST', hdrs),
                        {	
                            "merchantCode": d.merchantCode,
                            "mtype": d.mtype,
                            "customerName": d.title,
                            "mobileNumber": d.phone,
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
                            me.savePaymentLinkProductsPost(d.merchantCode, d.products, 0, data, hdrs, cb);
                        });
                }
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    }
}

module.exports = sdkCont;