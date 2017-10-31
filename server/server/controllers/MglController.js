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
var helper = require('./../utils/Helper');
var urls = require('./../utils/URLs');
var atob = require('atob');
var Jimp = require("jimp");
var http;

if (config.beNowSvc.https == 'http://')
    http = require('http');
else
    http = require('https');

var benowCont = {
    
    getToken(req) {
        if (req.headers) {
            if (req.headers['X-AUTHORIZATION'])
                return (req.headers['X-AUTHORIZATION']).toString();
            else if (req.headers['x-authorization'])
                return (req.headers['x-authorization']).toString();
        }

        return '';
    },


    mglDetails: function (req, res) {
        var me = this;
        this.mglDetailsPost(req, function (data) {           
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
                if (d) {
              helper.postAndCallback(helper.getDefaultExtServerOptions('/payments//paymentadapter/savePaymentPreActionData', 'POST', req.headers),
                        { 
                     "transactionRef":d.transactionRef,
                     "actionData":d.actionData,
                     "tag1":d.tag1,
                     "tag2":d.tag2,
                     "tag3":d.tag3,
                     "val1":d.val1,
                     "val2":d.val2,
                     "val3":d.val3  
                    },  cb);

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