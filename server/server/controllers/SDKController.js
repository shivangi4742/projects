var crypto = require('crypto');
const NodeCache = require("node-cache");

var helper = require('./../utils/Helper');
var config = require('./../configs/Config');

const pCache = new NodeCache({ stdTTL: 1200, checkperiod: 120 });
var sdkCont = {
    startPaymentProcess: function(req, res) {
        res.setHeader("X-Frame-Options", "DENY");
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
                                        var s = pCache.set(data.hdrTransRefNumber, c);
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
                                                //TODO: We do not have payerid, calling police :)
                                                me.savePayerProducts(d.merchantCode, products, 0, data.hdrTransRefNumber, 100, hdrs, retErr, cb);
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