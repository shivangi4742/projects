var CryptoJS = require('crypto-js');
var urlencode = require('urlencode');
var request = require('request');
var config = require('./../configs/Config');
var http;
var nfcReqs = [];

if(config.beNowSvc.https == 'http://')
    http = require('http');
else
    http = require('https');

var nfcCont = {
    getDefaultExtServerOptions: function (path, method, headers) {
        var extServerOptions = {
            host: config.beNowSvc.host,
            port: config.beNowSvc.port,
            path: path,
            method: method,
            headers: {}
        };

        if (headers['user-agent'])
            extServerOptions.headers['User-Agent'] = headers['user-agent'];
        else if (headers['User-Agent'])
            extServerOptions.headers['User-Agent'] = headers['User-Agent'];
        else
            extServerOptions.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36';

        if (headers['content-type'])
            extServerOptions.headers['Content-Type'] = headers['content-type'];
        else if (headers['Content-Type'])
            extServerOptions.headers['Content-Type'] = headers['Content-Type'];
        else
            extServerOptions.headers['Content-Type'] = 'application/json';

        if (headers['X-AUTHORIZATION'])
            extServerOptions.headers['X-AUTHORIZATION'] = headers['X-AUTHORIZATION'];
        else if (headers['x-authorization'])
            extServerOptions.headers['X-AUTHORIZATION'] = headers['x-authorization'];
        else
            extServerOptions.headers['X-AUTHORIZATION'] = config.defaultToken

        if (headers['X-EMAIL'])
            extServerOptions.headers['X-EMAIL'] = headers['X-EMAIL'];
        else if (headers['x-email'])
            extServerOptions.headers['X-EMAIL'] = headers['x-email'];
        else
            extServerOptions.headers['X-EMAIL'] = config.defaultEmail;

        return extServerOptions;
    },

    getExtServerOptions: function(path, method, headers) {
        var extServerOptions = {
            host: config.beNowSvc.host,
            port: config.beNowSvc.port,
            path: path,
            method: method,
            headers: {}
        };

        if(headers['user-agent'])
            extServerOptions.headers['User-Agent'] = headers['user-agent'];
        else if(headers['User-Agent'])
            extServerOptions.headers['User-Agent'] = headers['User-Agent'];
        else
            extServerOptions.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36';

        if(headers['content-type'])
            extServerOptions.headers['Content-Type'] = headers['content-type'];
        else if(headers['Content-Type'])
            extServerOptions.headers['Content-Type'] = headers['Content-Type'];
        else
            extServerOptions.headers['Content-Type'] = 'application/json';

        if(headers['X-AUTHORIZATION'])
            extServerOptions.headers['X-AUTHORIZATION'] = headers['X-AUTHORIZATION'];
        else if(headers['x-authorization'])
            extServerOptions.headers['X-AUTHORIZATION'] = headers['x-authorization'];

        if(headers['X-EMAIL'])
            extServerOptions.headers['X-EMAIL'] = headers['X-EMAIL'];
        else if(headers['x-email'])
            extServerOptions.headers['X-EMAIL'] = headers['x-email'];

        return extServerOptions;
    },

    postAndCallback: function(extServerOptions, obj, cb) {
        try {
            var reqPost = http.request(extServerOptions, function (res) {
                var buffer = ''; 
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    buffer += chunk;
                });
                res.on('end', function (err) {
                    if(res.statusCode === 200) 
                        cb(JSON.parse(buffer));
                    else if(res.statusCode === 400 && buffer) {
                        var dta = JSON.parse(buffer);
                        if(dta.validationErrors)
                            cb({'success': false, 'status': res.statusCode, 'validationErrors': dta.validationErrors});
                        else
                            cb({'success': false, 'status': res.statusCode});
                    }
                    else
                        cb({'success': false, 'status': res.statusCode});
                });
            });

            reqPost.write(JSON.stringify(obj));
            reqPost.end();
            reqPost.on('error', function(e) {
                cb({'error': e, 'success': false});
            });
        }
        catch(e) {
            cb({'success': false, 'status': 501, 'validationErrors': 'Output is not in proper format'});
        }
    },

    getToken(req) {
        if(req.headers) {
            if(req.headers['X-AUTHORIZATION'])
                return (req.headers['X-AUTHORIZATION']).toString();
            else if (req.headers['x-authorization'])
                return (req.headers['x-authorization']).toString();
        }

        return '';
    },

    encryptPayload: function(data) {
        return CryptoJS.AES.encrypt(JSON.stringify(data), 'bnnfcyatish').toString();
    },

    decryptPayLoad: function(data) {
        return JSON.parse(CryptoJS.AES.decrypt(data, 'bnnfcyatish').toString(CryptoJS.enc.Utf8));
    },

    getBalance: function(req, res) {
        this.getBalancePost(req, function(data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json(data);
        });
    },

    getBalancePost: function(req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if(!req || !req.body) {
                cb(retErr);
            }
            else {
                var d = req.body;
                if( d && d.merchantCode && d.customerId) {
                    this.postAndCallback(this.getExtServerOptions('/merchants/merchant/getEkhatabalance', 'POST', req.headers), 
                        {
                            "merchantCode": d.merchantCode,
                            "customerId": d.customerId
                        }, 
                        cb);
                }
                else
                    cb(retErr);
            }
        }
        catch(err) {
            cb(retErr);
        }
    },

    resetCustomer: function(req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        try {
            var index = -1;
            if(nfcReqs && nfcReqs.length > 0) {
                for(var i = 0; i < nfcReqs.length; i++) {
                    if(nfcReqs[i].till == req.body.till && nfcReqs[i].merchantCode == req.body.merchantCode) {
                        index = i;
                        break;
                    }
                }
            }

            if(index >= 0)
                nfcReqs.splice(i, 1);

            res.json(true);        
        }
        catch(err) {
            res.json(false);
        }
    },

    seekPaymentApproval: function(req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        try {
            if(nfcReqs && nfcReqs.length > 0) {
                for(var i = 0; i < nfcReqs.length; i++) {
                    if(nfcReqs[i].till == req.body.till && nfcReqs[i].merchantCode == req.body.merchantCode 
                        && nfcReqs[i].customerId == req.body.customerId) {
                        nfcReqs[i].amount = req.body.amount;
                        break;
                    }
                }
            }

            res.json(true);        
        }
        catch(err) {
            res.json(false);
        } 
    },

    getAmount: function(req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        try {
            var exists = false;
            if(req && req.params && req.params.data) {
                var d = this.decryptPayLoad(req.params.data);
                if(d && d.indexOf('|') > 0) {
                    var da = d.split('|');
                    if(da && da.length > 2 && da[0] && da[1] && da[2]) {
                        if(nfcReqs && nfcReqs.length > 0) {
                            for(var i = 0; i < nfcReqs.length; i++) {
                                if(nfcReqs[i].till == da[0] && nfcReqs[i].merchantCode == da[1] && nfcReqs[i].customerId == da[2]) {
                                    exists = true;
                                    if(nfcReqs[i].amount > 0)
                                        res.json({"amount": nfcReqs[i].amount});
                                    else
                                        res.json(null);
                                }
                            }
                        }
                    }
                }
            }

            if(!exists)
                res.json(null);
        }
        catch(err) {
            res.json(null);
        }
    },

    payUsingEKhata: function(nfcAccount, hdrs, cb) {
        try {
            var obj = {
                "till": nfcAccount.till,
                "amount": nfcAccount.amount,
                "hdrTransRefNumber": "",
                "listPayments": [
                    {
                        "paymentDetails": {
                            "deviceDetails": {
                                "applicationName": "NFC",
                                "deviceId": "browser",
                                "mobileNumber": nfcAccount.customerId
                            },
                            "merchantCode": nfcAccount.merchantCode,
                            "merchantName": "Benow Cafe",//HARD CODED
                            "payeeVirtualAddress": "AA3Q7001@yesbank",//HARD CODED
                            "payerUsername": nfcAccount.customerId,
                            "paymentInvoice": {
                                "amountPayable": nfcAccount.amount
                            },
                            "remarks": ""
                        },
                        "paymentMethodType": "EKHATA"
                    }
                ]
            };
            var me = this;
            this.postAndCallback(this.getDefaultExtServerOptions('/payments/paymentadapter/initiatePayWebRequest', 'POST', hdrs), obj,
                function(data) {
                    try {
                        if (data && data.hdrTransRefNumber) {
                            var success = {
                                "amount": nfcAccount.amount,
                                "hdrTransRefNumber": data.hdrTransRefNumber,
                                "listPayments": [
                                    {
                                        "paymentDetails": {
                                            "deviceDetails": {
                                                "applicationName": "nfc",
                                                "deviceId": "browser",
                                                "mobileNumber": nfcAccount.customerId
                                            },
                                            "merchantCode": nfcAccount.merchantCode,
                                            "merchantName": "Benow Cafe",//HARD CODED
                                            "payeeVirtualAddress": "AA3Q7001@yesbank",//HARD CODED
                                            "payerUsername": nfcAccount.customerId,
                                            "paymentInvoice": {
                                                "amountPayable": nfcAccount.amount
                                            },
                                            "remarks": "",
                                            "thirdPartyTransactionResponseVO": {
                                                "referanceNumber": data.hdrTransRefNumber,
                                                "response": JSON.stringify({"message": "EKHATA Auto Success"})//What should go here?
                                            },
                                            "txnId": data.hdrTransRefNumber
                                        },
                                        "paymentMethodType": "EKHATA",
                                        "paymentTransactionStatus": {
                                            "transactionStatus": "Successful"
                                        }
                                    }
                                ]
                            }
                            me.postAndCallback(me.getDefaultExtServerOptions('/payments/paymentadapter/payWebRequest', 'POST', hdrs), success,
                            cb);
                        }
                        else
                            cb(null);
                    }
                    catch(err) {
                        cb(null);
                    }
                });
        }
        catch(err) {
            cb(null)
        }
    },

    approve: function(req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        try {
            var exists = false;
            if(req && req.body && req.params && req.params.data && req.body.amount && req.body.pin) {
                if(req.body.pin == '1234') {
                    var d = this.decryptPayLoad(req.params.data);
                    if(d && d.indexOf('|') > 0) {
                        var da = d.split('|');
                        if(da && da.length > 2 && da[0] && da[1] && da[2]) {
                            if(nfcReqs && nfcReqs.length > 0) {
                                for(var i = 0; i < nfcReqs.length; i++) {
                                    if(nfcReqs[i].till == da[0] && nfcReqs[i].merchantCode == da[1] && nfcReqs[i].customerId == da[2]) {
                                        exists = true;
                                        if(nfcReqs[i].amount == req.body.amount) {
                                            var finalReq = nfcReqs[i];
                                            this.payUsingEKhata(finalReq, req.headers, function(outdata) {
                                                try {
                                                    if(outdata && outdata.transactionStatus && outdata.transactionStatus.toLowerCase() == 'successful' 
                                                        && outdata.txnRefNumber) {
                                                        finalReq.status = 'paid';
                                                        res.json({isSuccess: true, txnId: outdata.txnRefNumber});
                                                    }
                                                    else
                                                        res.json(null);
                                                }
                                                catch(err) {
                                                    res.json(null);
                                                }
                                            });
                                        }
                                        else
                                            res.json({isError: true, errorMsg: 'Amount mismatch!'});
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    exists = true;
                    res.json({isError: true, errorMsg: 'Invalid PIN'});
                }
            }

            if(!exists)
                res.json(null);
        }
        catch(err) {
            res.json(null);
        }
    },

    getCustomer: function(req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        try {
            var exists = false;
            if(req && req.body.till && req.body.merchantCode) {
                if(nfcReqs && nfcReqs.length > 0) {
                    for(var i = 0; i < nfcReqs.length; i++) {
                        if(nfcReqs[i].till == req.body.till && nfcReqs[i].merchantCode == req.body.merchantCode) {
                            exists = true;
                            res.json(nfcReqs[i]);
                        }
                    }
                }
            }

            if(!exists)
                res.json(null);
        }
        catch(err) {
            res.json(null);
        }
    },

    takeRequest: function(data) {
        try {
            var d = this.decryptPayLoad(data);
            if(d && d.indexOf('|') > 0) {
                var da = d.split('|');
                if(da && da.length > 2 && da[0] && da[1] && da[2]) {
                    var exists = false;
                    if(nfcReqs && nfcReqs.length > 0) {
                        for(var i = 0; i < nfcReqs.length; i++) {
                            if(nfcReqs[i].till == da[0] && nfcReqs[i].merchantCode == da[1]) {
                                exists = true;
                                nfcReqs[i].customerId = da[2];
                            }
                        }                    
                    }

                    if(!exists)
                        nfcReqs.push({
                            till: da[0],
                            merchantCode: da[1],
                            customerId: da[2]
                        });
                }
            }
        }
        catch(err) {
            
        }
    }
}

module.exports = nfcCont;