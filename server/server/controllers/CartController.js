var request = require('request');

var helper = require('./../utils/Helper');
var config = require('./../configs/Config');

var cartCont = {    
    processPayment: function(req, res) {
        try {
            var d = req.body;
            var drop_cat = '';
            if (d.paytype == 'CC')
                drop_cat = 'DC,NB,EMI,CASH';
            else if (d.paytype == 'DC')
                drop_cat = 'CC,NB,EMI,CASH';
            else if (d.paytype == 'NB')
                drop_cat = 'CC,DC,EMI,CASH';
    
            var headers = {
                'X-AUTHORIZATION': config.paymentGateway.xauth,
                'Content-Type': 'application/json'
            };
    
            var surl = config.paymentGateway.buysurl + d.merchantcode + '/paymentsuccess/' + d.txnid;
            var furl = config.paymentGateway.buyfurl + d.merchantcode + '/paymentfailure/' + d.txnid;
    
            var payload = {
                "key": config.paymentGateway.key,
                "curl": config.paymentGateway.curl,
                "surl": surl,
                "furl": furl,
                "ismobileview": d.ismobileview,
                "txnid": d.txnid,
                "drop_category": drop_cat,
                "phone": d.phone,
                "amount": d.payamount,
                "lastname": '',
                "firstname": d.name,
                "productinfo": d.productinfo,
                "email": d.email ? d.email : ''
            };
    
            if (d.paytype == 'NB')
                payload.pg = 'NB';
    
            var obj = {
                "amount": d.payamount,
                "email": payload.email,
                "firstName": payload.firstname,
                "furl": payload.furl,
                "merchantKey": payload.key,
                "productInfo": payload.productinfo,
                "surl": payload.surl,
                "transactionNumber": d.txnid,
                "phone": payload.phone,
                "username": payload.phone
            };
            this.hashPayloadPost(obj, headers, payload, res);    
        }
        catch (err) {
            res.redirect(config.paymentGateway.buyfurl + d.merchantcode + '/paymentfailure/' + d.txnid);
        }
    },

    hashPayloadPost: function (obj, headers, payload, rd) {
        try {
            helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/getWebCalculatedHash', 'POST', headers), obj,
                function (data) {
                    if (data && data.hash) {
                        var hp = JSON.parse(data.hash);
                        payload.hash = hp.payment_hash;
                        request.post({ url: config.paymentGateway.url, form: payload },
                            function (err, remoteResponse, remoteBody) {
                                try {
                                    if (err)
                                        res.redirect(config.paymentGateway.buyfurl + d.merchantcode + '/paymentfailure/' + d.txnid);

                                    if (remoteResponse && remoteResponse.caseless && remoteResponse.caseless.dict)
                                        rd.redirect(remoteResponse.caseless.dict.location);
                                    else
                                        res.redirect(config.paymentGateway.buyfurl + d.merchantcode + '/paymentfailure/' + d.txnid);
                                }
                                catch (error) {
                                    res.redirect(config.paymentGateway.buyfurl + d.merchantcode + '/paymentfailure/' + d.txnid);
                                }
                            });
                    }
                    else
                        res.redirect(config.paymentGateway.buyfurl + d.merchantcode + '/paymentfailure/' + d.txnid);
                });
        }
        catch (err) {
            res.redirect(config.paymentGateway.buyfurl + d.merchantcode + '/paymentfailure/' + d.txnid);
        }
    },

    startPaymentProcessPost: function (req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            var d = req.body;
            var me = this;
            var hdrs = req.headers;
            if (d && d.payamount && d.merchantcode && d.phone) {
                var obj = {
                    "amount": d.payamount,
                    "hdrTransRefNumber": "",
                    "listPayments": [
                        {
                            "paymentDetails": {
                                "deviceDetails": {
                                    "applicationName": "web store",
                                    "deviceId": "browser",
                                    "mobileNumber": d.phone
                                },
                                "merchantCode": d.merchantcode,
                                "merchantName": d.merchantname,
                                "payeeVirtualAddress": d.merchantvpa,
                                "payerUsername": d.phone,
                                "paymentInvoice": {
                                    "amountPayable": d.payamount
                                },
                                "remarks": ""
                            },
                            "paymentMethodType": d.paytype
                        }
                    ]
                };

                helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/checkPayer', 'POST', hdrs),
                    {
                        "userId": d.phone
                    },
                    function (uData) {
                        if (uData && uData.responseFromAPI == true) {
                            helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/initiatePayWebRequest', 'POST', hdrs),
                                obj,
                                function (data) {
                                    if (data && data.hdrTransRefNumber) {
                                        helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/getPpPayer', 'POST', hdrs),
                                            {
                                                "name": d.name,
                                                "address": d.address,
                                                "email": d.email,
                                                "mobileNo": d.phone,
                                                "transactionRef": data.hdrTransRefNumber,
                                                "merchantCode": d.merchantcode,
                                                "amount": d.payamount,
                                                "txnDate": Date.now()
                                            },
                                            function (sdata) {
                                                if(sdata && sdata.amount) {
                                                    var cartitemsobj = {
                                                        "transactionRef": data.hdrTransRefNumber,
                                                        "payerProductVOs": []
                                                    };

                                                    for(var counter = 0; counter < d.products.length; counter++) {
                                                        cartitemsobj.payerProductVOs.push({
                                                            "merchantCode": d.merchantcode,
                                                            "quantity": d.products[counter].quantity,
                                                            "price": d.products[counter].offerPrice,
                                                            "prodName": d.products[counter].name,
                                                            "prodDescription": d.products[counter].description,
                                                            "color": d.products[counter].color,
                                                            "size": d.products[counter].size,
                                                            "prodImgUrl": d.products[counter].imageURL ? d.products[counter].imageURL.replace(config.prodImgURLPrefix, '') : '',
                                                            "originalPrice": d.products[counter].origPrice
                                                        });
                                                    }

                                                    helper.postAndCallback(
                                                        helper.getDefaultedExtServerOptions('/payments/paymentadapter/savePayerProductWithoutCampaign',
                                                        'POST', hdrs), cartitemsobj, function(pdata) {
                                                        if(pdata && pdata.responseFromAPI)
                                                            cb({ "transactionRef": data.hdrTransRefNumber });
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

    startPaymentProcess: function(req, res) {
        res.setHeader("X-Frame-Options", "ALLOW");
        this.startPaymentProcessPost(req, function (data) {
            res.json(data);
        });
    }
}

module.exports = cartCont;