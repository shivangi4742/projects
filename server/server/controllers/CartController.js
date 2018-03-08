var helper = require('./../utils/Helper');

var cartCont = {    
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
                                                "txnDate": helper.getCurDateTimeString
                                            },
                                            function (sdata) {
                                                if(sdata && sdata.amount) {
                                                    cb({ "transactionRef": data.hdrTransRefNumber });
                                                    /* var cartitemsobj = {
                                                        "transactionRef": data.hdrTransRefNumber,
                                                        "payerProductVOs": []
                                                    };

                                                    for(var counter = 0; counter < d.products.length; counter++) {
                                                        cartitemsobj.payerProductVOs.push({
                                                            "merchantCode": d.merchantcode,
                                                            "quantity": d.products[i].quantity,
                                                            "price": d.products[i].offerPrice,
                                                            "prodName": d.products[i].name,
                                                            "prodDescription": d.products[i].description,
                                                            "color": d.products[i].color,
                                                            "size": d.products[i].size
                                                        });
                                                    }

                                                    helper.postAndCallback(helper.getDefaultedExtServerOptions('/payments/paymentadapter/savePayerProductWithoutCampaign',
                                                        'POST', hdrs), cartitemsobj, function(pdata) {
                                                        if(pdata && pdata.responseFromAPI)
                                                            cb({ "transactionRef": data.hdrTransRefNumber });
                                                        else
                                                            cb(retErr);
                                                    }); */
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