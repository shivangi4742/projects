var fs = require('fs');
var CryptoJS = require('crypto-js');
var uuid = require('uuid');
var request = require('request');
var findRemoveSync = require('find-remove');
var readChunk = require('read-chunk');
var fileType = require('file-type');
var sizeOf = require('image-size');
const NodeCache = require("node-cache");
const pCache = new NodeCache({ stdTTL: 1200, checkperiod: 120 });
var config = require('./../configs/Config');
var urls = require('./../utils/URLs');
var atob = require('atob');
var Jimp = require("jimp");
var http;

if (config.beNowSvc.https == 'http://')
    http = require('http');
else
    http = require('https');

var benowCont = {
    getAndCallback: function (extServerOptions, cb, notJSON) {
        return http.get({
            host: extServerOptions.host,
            path: extServerOptions.path,
            port: extServerOptions.port,
            headers: extServerOptions.headers
        }, function (res) {
            var body = '';
            res.setEncoding('utf8');
            res.on('data', function (d) {
                body += d;
            });
            res.on('end', function () {
                if (res.statusCode === 200)
                    if (body)
                        if (notJSON)
                            cb(body);
                        else
                            cb(JSON.parse(body));
                    else
                        cb(null);
                else if (res.statusCode === 400 && body) {
                    var dta = JSON.parse(body);
                    if (dta.validationErrors)
                        cb({ 'success': false, 'status': res.statusCode, 'validationErrors': dta.validationErrors });
                    else
                        cb({ 'success': false, 'status': res.statusCode });
                }
                else
                    cb({ 'success': false, 'status': res.statusCode });
            });
        });
    },

    postAndCallbackString: function (extServerOptions, obj, cb) {
        try {
            var reqPost = http.request(extServerOptions, function (res) {
                var buffer = '';
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    buffer += chunk;
                });
                res.on('end', function (err) {
                    if (res.statusCode === 200)
                        cb({ 'url': buffer.toString() });
                    else if (res.statusCode === 400 && buffer) {
                        var dta = JSON.parse(buffer);
                        if (dta.validationErrors)
                            cb({ 'success': false, 'status': res.statusCode, 'validationErrors': dta.validationErrors });
                        else
                            cb({ 'success': false, 'status': res.statusCode });
                    }
                    else
                        cb({ 'success': false, 'status': res.statusCode });
                });
            });

            reqPost.write(JSON.stringify(obj));
            reqPost.end();
            reqPost.on('error', function (e) {
                cb({ 'error': e, 'success': false });
            });
        }
        catch (e) {
            cb({ 'success': false, 'status': 501, 'validationErrors': 'Output is not in proper format' });
        }
    },

    postAndCallback: function (extServerOptions, obj, cb) {
        try {
            
            var reqPost = http.request(extServerOptions, function (res) {
               
                var buffer = '';
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    buffer += chunk;
                });
                res.on('end', function (err) {
                    if (res.statusCode === 200)
                        cb(JSON.parse(buffer));
                    else if (res.statusCode === 400 && buffer) {
                        var dta = JSON.parse(buffer);
                        if (dta.validationErrors)
                            cb({ 'success': false, 'status': res.statusCode, 'validationErrors': dta.validationErrors });
                        else
                            cb({ 'success': false, 'status': res.statusCode });
                    }
                    else
                        cb({ 'success': false, 'status': res.statusCode });
                });
            });
          
            reqPost.write(JSON.stringify(obj));
            reqPost.end();
            reqPost.on('error', function (e) {
                cb({ 'error': e, 'success': false });
            });
        }
        catch (e) {
            cb({ 'success': false, 'status': 501, 'validationErrors': 'Output is not in proper format' });
        }
    },

    getDefaultExtFileServerOptions: function (path, method, headers) {
        var extServerOptions = {
            uri: path,
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

    getToken(req) {
        if (req.headers) {
            if (req.headers['X-AUTHORIZATION'])
                return (req.headers['X-AUTHORIZATION']).toString();
            else if (req.headers['x-authorization'])
                return (req.headers['x-authorization']).toString();
        }

        return '';
    },

    encryptPayload: function (data, token, useToken) {
        if (!token || !useToken)
            token = 'NMRCbn';

        return CryptoJS.AES.encrypt(JSON.stringify(data), token).toString();
    },

    decryptPayLoad: function (data, token, useToken) {
        if (!token || !useToken)
            token = 'NMRCbn';

        return JSON.parse(CryptoJS.AES.decrypt(data, token).toString(CryptoJS.enc.Utf8));
    },
   
  

    mglDetails: function (req, res) {
        var me = this;
        this.mglDetailsPost(req, function (data) {           
           console.log('data', data);
            res.json({ "data": data});
        });
    },

    mglDetailsPost: function (req,  cb) {
        var retErr = {
            "success": false,
            "token": null,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
        d = req.body.consumerno;
        request.get({
        url: 'https://www.mahanagargas.com/ver2/bill_xml.asp?CA='+d,
        headers: {
            "Content-Type": "text/html"
        },
 
        }, function (error, response, body) {
            if (error) {
                console.log(error);
            }
          
        var parseString = require('xml2js').parseString;
        
        parseString(response.body, function (err, result){
       
           cb(result);
           
            });
        });

      }
        catch (err) {
            cb(retErr);
        }
    },

  mglDetailsSave: function (req, res) {
     
      var token = this.getToken(req);
        var me = this;
        this.mglDetailsSavePost(req, token, function (data) {           
          
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": data});
        });
    },

    mglDetailsSavePost: function (req, token, cb) {
         var retErr = {
            "success": false,
            "token": null,
            "errorCode": "Something went wrong. Please try again."
        };
         try {
            if (!req || !req.body) { 
                cb(retErr);
                
            }
            else {
    
                var d = req.body;
              
                var p =  {
                     "transactionRef":d.transactionRef,
                     "actionData":d.actionData,
                     "tag1":d.tag1,
                     "tag2":d.tag2,
                     "tag3":d.tag3,
                     "val1":d.val1,
                     "val2":d.val2,
                     "val3":d.val3
                    } ; 
                           
                if (d) {
                    this.postAndCallback(this.getDefaultExtServerOptions('/payments//paymentadapter/savePaymentPreActionData', 'POST', req.headers),
                        { p },  cb);

                }
                else
                { 
                    cb(retErr);}
                    
            }
        }
        catch (err) {
            cb(retErr);
        }
    },    



paymentSuccess : function(req, res) {
   var inpObj = req.body;
   res.send('<!doctype html>'
                +'<html lang="en">'
                + '<head>'
                + '<meta charset="utf-8">'
                + '<title>Benow - Mahanagar Gas Bill</title>'
                + '<base href="/">'
                + '<meta name="viewport" content="width=device-width, initial-scale=1">'
                + '<link rel="icon" type="image/x-icon" href="favicon.ico">'
                + '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">'
                + '<link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">'
                + '<link href="https://fonts.googleapis.com/css?family=Fjalla+One" rel="stylesheet">'
                + '<style>'
                + 'app-root {'
                +    'display: flex;'
                +    'min-height: 96vh;'
                +     'flex-direction: column;'
                +  ' }'
                +  '    main {'
                +  '      flex: 1 0 auto;'
                +  '    }'
                +  '  </style>'
                +  '</head>'
                +  '<body>'
                + " <input type='hidden' id='paymentSuccessData' value='" + JSON.stringify(inpObj) + "' />" 
                +  '  <app-root></app-root>'
        +  '        <script type="text/javascript" src="http://localhost:9090/mgl/inline.bundle.js"></script>'
        +  '        <script type="text/javascript" src="http://localhost:9090/mgl/polyfills.bundle.js"></script>'
        +  '        <script type="text/javascript" src="http://localhost:9090/mgl/scripts.bundle.js"></script>'
        +  '        <script type="text/javascript" src="http://localhost:9090/mgl/styles.bundle.js"></script>'
        +  '        <script type="text/javascript" src="http://localhost:9090/mgl/vendor.bundle.js"></script>'
        +  '        <script type="text/javascript" src="http://localhost:9090/mgl/main.bundle.js"></script>'
                +  '</body>'
                +  '</html>' );

},

paymentfailure: function(req, res) {
    var inpObj = req.body;
    var data = {
        "error_message": inpObj.error_message
    };
   res.send('<!doctype html>'
        +'<html lang="en">'
        + '<head>'
        + '<meta charset="utf-8">'
        + '<title>Benow - Mahanagar Gas Bill</title>'
        + '<base href="/">'
        + '<meta name="viewport" content="width=device-width, initial-scale=1">'
        + '<link rel="icon" type="image/x-icon" href="favicon.ico">'
        + '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">'
        + '<link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">'
        + '<link href="https://fonts.googleapis.com/css?family=Fjalla+One" rel="stylesheet">'
        + '<style>'
        + 'app-root {'
        +    'display: flex;'
        +    'min-height: 96vh;'
        +     'flex-direction: column;'
        +  ' }'
        +  '    main {'
        +  '      flex: 1 0 auto;'
        +  '    }'
        +  '  </style>'
        +  '</head>'
        +  '<body>'
        + " <input type='hidden' id='paymentFailureData' value='" + JSON.stringify(inpObj) + "' />" 
        +  '  <app-root></app-root>'
        +  '        <script type="text/javascript" src="http://localhost:9090/mgl/inline.bundle.js"></script>'
        +  '        <script type="text/javascript" src="http://localhost:9090/mgl/polyfills.bundle.js"></script>'
        +  '        <script type="text/javascript" src="http://localhost:9090/mgl/scripts.bundle.js"></script>'
        +  '        <script type="text/javascript" src="http://localhost:9090/mgl/styles.bundle.js"></script>'
        +  '        <script type="text/javascript" src="http://localhost:9090/mgl/vendor.bundle.js"></script>'
        +  '        <script type="text/javascript" src="http://localhost:9090/mgl/main.bundle.js"></script>'
        +  '</body>'
        +  '</html>'    
        );

}
   
}

module.exports = benowCont;