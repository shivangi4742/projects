var crypto = require('crypto');
var request = require('request');
const NodeCache = require("node-cache");

var helper = require('./../utils/Helper');
var config = require('./../configs/Config');

var sdkCont = {
    paymentFailure: function(req, cb) {
        try {
            var headers = {
                'X-AUTHORIZATION': config.defaultToken,
                'Content-Type': 'application/json'
            };
            var status = req.body.status;
            var statusMsg = 'Failed';
            if (status && status.toLowerCase() == 'success')
                statusMsg = 'Successful';

            var pmtype = 'DEBIT_CARD';
            if (req.body.mode === 'CC')
                pmtype = 'CREDIT_CARD';
            else if (req.body.mode = 'NB')
                pmtype = 'NET_BANKING';
            helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/payWebRequest', 'POST', headers),
                {
                    "amount": req.body.amount,
                    "hdrTransRefNumber": req.body.txnid,
                    "listPayments": [
                        {
                            "paymentDetails": {
                                "deviceDetails": {
                                    "applicationName": "com.benow",
                                    "deviceId": "browser",
                                    "mobileNumber": req.body.phone
                                },
                                "merchantCode": req.body.udf2,
                                "merchantName": req.body.udf3,
                                "payeeVirtualAddress": "",
                                "payerUsername": req.body.phone,
                                "paymentInvoice": {
                                    "amountPayable": req.body.amount
                                },
                                "remarks": "",
                                "thirdPartyTransactionResponseVO": {
                                    "referanceNumber": req.body.txnid,
                                    "response": JSON.stringify(req.body)
                                },
                                "txnId": req.body.txnid
                            },
                            "paymentMethodType": pmtype,
                            "paymentTransactionStatus": {
                                "transactionStatus": statusMsg
                            }
                        }
                    ]
                },
                cb);
        }
        catch (err) {
            cb();
        }
    },

    paymentSuccess: function(req, cb) {
        try {
            var headers = {
                'X-AUTHORIZATION': config.defaultToken,
                'Content-Type': 'application/json'
            };

            var status = req.body.status;
            var statusMsg = 'Failed';
            if (status && status.toLowerCase() == 'success')
                statusMsg = 'Successful';

            var pmtype = 'DEBIT_CARD';
            if (req.body.mode === 'CC')
                pmtype = 'CREDIT_CARD';
            else if (req.body.mode = 'NB')
                pmtype = 'NET_BANKING';

            helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/payWebRequest', 'POST', headers),
                {
                    "amount": req.body.amount,
                    "hdrTransRefNumber": req.body.txnid,
                    "listPayments": [
                        {
                            "paymentDetails": {
                                "deviceDetails": {
                                    "applicationName": "com.benow",
                                    "deviceId": "browser",
                                    "mobileNumber": req.body.phone
                                },
                                "merchantCode": req.body.udf2,
                                "merchantName": req.body.udf3,
                                "payeeVirtualAddress": "",
                                "payerUsername": req.body.phone,
                                "paymentInvoice": {
                                    "amountPayable": req.body.amount
                                },
                                "remarks": "",
                                "thirdPartyTransactionResponseVO": {
                                    "referanceNumber": req.body.txnid,
                                    "response": JSON.stringify(req.body)
                                },
                                "txnId": req.body.txnid
                            },
                            "paymentMethodType": pmtype,
                            "paymentTransactionStatus": {
                                "transactionStatus": statusMsg
                            }
                        }
                    ]
                },
                cb);
        }
        catch (err) {
            cb();
        }
    },

    processPayment: function(req, res) {
    	res.setHeader("X-Frame-Options", "ALLOW");
        var paylinkid = req.body.paylinkid;
        try {
            var cat = req.body.paytype;
            var drop_cat = 'DC,NB,EMI,CASH';
            if (cat == 1)
                drop_cat = 'DC,NB,EMI,CASH';
            else if (cat == 2)
                drop_cat = 'CC,NB,EMI,CASH';
            else if (cat == 3)
                drop_cat = 'CC,DC,EMI,CASH';

            var headers = {
                'X-AUTHORIZATION': config.paymentGateway.xauth,
                'Content-Type': 'application/json'
            };
            var surl = config.paymentGateway.newsurl + paylinkid + '/' + req.body.txnid;
            var furl = config.paymentGateway.newfurl + paylinkid + '/' + req.body.txnid;
            if (req.body.sourceId == 2) {
                surl = req.body.surl;
                furl = req.body.furl;
            }
            else if (req.body.sourceId == 1) {
                surl = config.paymentGateway.sdksurl + paylinkid + '/' + req.body.txnid;
                furl = config.paymentGateway.sdkfurl + paylinkid + '/' + req.body.txnid;
            }
            else {
                if(req.body.surl && req.body.surl.length > 4)
                    surl = req.body.surl;

                if(req.body.furl && req.body.furl.length > 4)
                    furl = req.body.furl;
            }
            var payload = {
                "key": config.paymentGateway.key,
                "curl": config.paymentGateway.curl,
                "surl": surl,
                "furl": furl,
                "udf1": paylinkid,
                "udf2": req.body.merchantcode,
                "udf3": req.body.merchantname,
                "udf4": req.body.udf4,
                "udf5": req.body.udf5,
                "ismobileview": req.body.ismobileview,
                "txnid": req.body.txnid,
                "drop_category": drop_cat,
                "phone": req.body.mobileNo,
                "amount": req.body.payamount,
                "lastname": req.body.lastname,
                "firstname": req.body.firstname,
                "productinfo": req.body.merchantname,
                "email": req.body.email ? req.body.email : ""
            };

            if (cat == 3)
                payload.pg = 'NB';

            var obj = {
                "amount": req.body.payamount,
                "email": payload.email,
                "firstName": payload.firstname,
                "furl": payload.furl,
                "merchantKey": payload.key,
                "productInfo": payload.productinfo,
                "surl": payload.surl,
                "transactionNumber": req.body.txnid,
                "udf1": payload.udf1,
                "udf2": payload.udf2,
                "udf3": payload.udf3,
                "udf4": payload.udf4,
                "udf5": payload.udf5,
                "phone": payload.phone,
                "username": payload.phone
            };
            this.hashPayloadPost(paylinkid, obj, headers, payload, helper.getDefaultExtServerOptions, helper.postAndCallback, res);
        }
        catch (err) {
            res.redirect(config.paymentGateway.furl + paylinkid + '/' + req.body.txnid);
        }
    },

    hashPayloadPost: function (paylinkid, obj, headers, payload, cb1, cb2, rd) {
        try {
            cb2(cb1('/payments/paymentadapter/getWebCalculatedHash', 'POST', headers), obj,
                function (data) {
                    if (data && data.hash) {
                        var hp = JSON.parse(data.hash);
                        payload.hash = hp.payment_hash;
                        request.post({ url: config.paymentGateway.url, form: payload },
                            function (err, remoteResponse, remoteBody) {
                                try {
                                    if (err)
                                        rd.redirect(config.me + '/paymentfailure/' + paylinkid);

                                    if (remoteResponse && remoteResponse.caseless && remoteResponse.caseless.dict)
                                        rd.redirect(remoteResponse.caseless.dict.location);
                                    else
                                        rd.redirect(config.me + '/paymentfailure/' + paylinkid);
                                }
                                catch (error) {
                                    rd.redirect(config.me + '/paymentfailure/' + paylinkid);
                                }
                            });
                    }
                    else {
                        rd.redirect(config.me + '/paymentfailure/' + paylinkid);
                    }
                });
        }
        catch (err) {
            rd.redirect(config.me + '/paymentfailure/' + paylinkid);
        }
    },

    startPaymentProcess: function(req, res) {
    	res.setHeader("X-Frame-Options", "ALLOW");
        this.startPaymentProcessPost(req, function (data) {
            res.json(data);
        });  
    },

    savePayerProducts: function(merchantCode, products, counter, txnNumber, payerId, hdrs, retErr, cb) {
        try {
            var me = this;
            var retVal = { "transactionRef": txnNumber };
            if(products && products.length > counter) {
                helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/savePayerProduct', 'POST', hdrs),
                    {	
                        "merchantCode": merchantCode,
                        "transactionRef": txnNumber,
                        "payerId": payerId,
                        "product": products[counter].id,
                        "quantity": products[counter].qty,
                        "price": products[counter].price,
                        "amount": products[counter].price * products[counter].qty,
                        "prodName": products[counter].name,
                        "uom": products[counter].uom                    
                    },
                    function (data) {
                        me.savePayerProducts(merchantCode, products, ++counter, txnNumber, payerId, hdrs, retErr, cb);
                    });
            }
            else
                cb(retVal);
        }
        catch (err) {
            cb(retErr);
        }
    },

    startPaymentProcessPost: function(req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            var d = req.body;
            var paylinkid = '0';
            var me = this;
            var hdrs = req.headers;
            if (d && d.payamount && d.merchantcode && d.paylinkid) {
                paylinkid = d.paylinkid;
                var name = d.name;
                var address = d.address;
                var email = d.email;
                var mobileNo = d.mobileNo;
                var pan = d.pan;
                var resident = d.resident;
                var pt = 'UPI_OTHER_APP';
                if (d.paytype === 1)
                    pt = 'CREDIT_CARD';
                else if (d.paytype === 2)
                    pt = 'DEBIT_CARD';
                else if (d.paytype === 3)
                    pt = 'NET_BANKING';

                var obj = {
                    "amount": d.payamount,
                    "hdrTransRefNumber": "",
                    "listPayments": [
                        {
                            "paymentDetails": {
                                "deviceDetails": {
                                    "applicationName": "portable payment link",
                                    "deviceId": "browser",
                                    "mobileNumber": d.mobileNo
                                },
                                "merchantCode": d.merchantcode,
                                "merchantName": d.merchantname,
                                "payeeVirtualAddress": d.merchantVPA,
                                "payerUsername": d.mobileNo,
                                "paymentInvoice": {
                                    "amountPayable": d.payamount
                                },
                                "remarks": ""
                            },
                            "paymentMethodType": pt
                        }
                    ]
                };
                if(d.tr)
                    obj.tr = d.tr;

                if(d.til)
                    obj.till = d.til;

                var c = {
                    "xauth": config.defaultToken,
                    "merchantCode": d.merchantcode,
                    "merchantName": d.merchantname,
                    "merchantURL": d.merchantURL
                };
                var products = d.products;
                helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/checkPayer', 'POST', hdrs),
                    {
                        "userId": mobileNo
                    },
                    function (uData) {
                        if (uData && uData.responseFromAPI == true) {
                            helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/initiatePayWebRequest', 'POST', hdrs), 
                                obj,
                                function (data) {
                                    if (data && data.hdrTransRefNumber) {
                                        helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/getPpPayer', 'POST', hdrs),
                                            {
                                                "name": name,
                                                "address": address ? address : '',
                                                "email": email,
                                                "mobileNo": mobileNo,
                                                "pancard": pan,
                                                "residenceCountry": resident,
                                                "transactionRef": data.hdrTransRefNumber,
                                                "paymentLinkRef": paylinkid,
                                                "merchantCode": d.merchantcode,
                                                "amount": d.payamount,
                                                "txnDate": me.getCurDateTimeString
                                            },
                                            function (sdata) {
                                                //TODO: We do not have payerid, introducing ganda logic
                                                me.savePayerProducts(d.merchantCode, products, 0, data.hdrTransRefNumber, 
                                                    helper.gandaLogic(data.hdrTransRefNumber.toUpperCase()), hdrs, retErr, cb);
                                            });
                                    }
                                    else
                                        cb(retErr);
                                });
                        }
                        else
                            cb(retErr);
                    });
            }
            else
                cb(retErr);
        }
        catch (err) {
            cb(retErr);
        }
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