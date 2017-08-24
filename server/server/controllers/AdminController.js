var CryptoJS = require('crypto-js');
var request = require('request');
var config = require('./../configs/Config');
var http;

if(config.beNowSvc.https == 'http://')
    http = require('http');
else
    http = require('https');

var adminCont = {
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

    encryptPayload: function(data, token, useToken) {
        if(!token || !useToken)
            token = 'NMRCbn';

        return CryptoJS.AES.encrypt(JSON.stringify(data), token).toString();
    },

    decryptPayLoad: function(data, token, useToken) {
        if(!token || !useToken)
            token = 'NMRCbn';

        return JSON.parse(CryptoJS.AES.decrypt(data, token).toString(CryptoJS.enc.Utf8));
    },

    saveTicker: function(req, res) {
        var me = this;
        var token = this.getToken(req);
        this.saveTickerPost(req, token, function(data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({"data": me.encryptPayload(data, token, true)});
        });
    },

    saveTickerPost: function(req, token, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if(!req || !req.body || !req.body.data) {
                cb(retErr);
            }
            else {
                var d = this.decryptPayLoad(req.body.data, token, true);
                if( d && d.paramType && d.paramCode) {
                    if(d.key != config.tickerKey)
                        cb({"success": false, "errorCode": "You are not authorized to make this change."});
                    else
                        this.postAndCallback(this.getExtServerOptions('/merchants/merchant/saveParameters', 'POST', req.headers), 
                            {
                                "paramType": d.paramType,
                                "paramCode": d.paramCode,
                                "desc1": d.desc1 ? d.desc1 : '',
                                "desc2": d.desc2 ? d.desc2 : '',
                                "desc3": d.desc3 ? d.desc3 : '',
                                "val1": d.val1 ? d.val1 : 0,
                                "val2": d.val2 ? d.val2 : 0,
                                "val3": d.val3 ? d.val3 : 0
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
    }
}

module.exports = adminCont;