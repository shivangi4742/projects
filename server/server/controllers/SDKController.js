var helper = require('./../utils/Helper');
var config = require('./../configs/Config');

var sdkCont = {    
    getPaymentLinkDetails: function (req, res) {
        res.setHeader("X-Frame-Options", "DENY");
/*         this.getPaymentLinkDetailsPost(req, function (data) {
            res.json(data);
        });  */
    },

    smsPaymentLinkPost: function (name, merchant, mtype, phone, txnId, hdrs, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (mtype == 2) {
                if (!name)
                    name = 'Donor';

                helper.postAndCallback(helper.getExtServerOptions('/merchants/merchant/sendMerchantSMS?mobileNumber=' + phone + '&message=' +
                    encodeURI('Dear Donor, To contribute ' + merchant + ', please click on ' + config.me + '/pay/' + txnId),
                    'POST', hdrs), null, cb);
            }
            else {
                if (!name)
                    name = 'Customer';

                helper.postAndCallback(helper.getExtServerOptions('/merchants/merchant/sendMerchantSMS?mobileNumber=' + phone + '&message=' +
                    encodeURI('Dear Customer, To pay ' + merchant + ', please click on ' + config.me + '/pay/' + txnId),
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
                    this.savePaymentLinkDetailsPost(d.sdk, hdrs, function (data) {
                        if (data && data.paymentReqNumber && data.mobileNumber) {
                            me.smsPaymentLinkPost(data.customerName, d.firstName ? d.firstName : '' + ' ' + d.lastName ? d.lastName : '', 
                                d.sdk.mtype, data.mobileNumber, 
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
	                "prodDescription": products[counter].name,
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
                            "customerName": d.firstName ? d.firstName : '' + ' ' + d.lastName ? d.lastName : '',
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