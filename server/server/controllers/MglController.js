var fs = require('fs');
var crypto = require('crypto');
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

    getMd5: function (dataToHash, saltString) {
	    return crypto.createHash('md5').update(saltString).update(dataToHash).digest('hex');
    },

    hash: function (req, res) {
        var payloadObj = req.body;
        var inpObj = payloadObj.data;
        var merchantCode = payloadObj.merchantCode;
        var salt = 'abcd';
        var headers = req.headers;
        var stringToHash = inpObj + merchantCode + salt;
        var hashData = this.getMd5(payloadObj.strToHash + merchantCode + salt, salt);
        res.send({ "hash": hashData });
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
    mglremainSave: function (req, res) {
        var token = this.getToken(req);
          var me = this;
          this.mglremainSavePost(req, token, function (data) { 
              res.setHeader("X-Frame-Options", "DENY");
              res.json({ "data": data});
          });
      },
  
      mglremainSavePost: function (req, token, cb) {
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
                  console.log(d);     
                  if (d) {
                helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/savePreActionLog', 'POST', req.headers),
                          { 
                            "tag1":d.tag1,
                            "tag2":d.tag2,
                            "tag3":d.tag3,
                            "tag4":d.tag4,
                            "tag5":"",
                            "val1":"",
                            "val2":"",
                            "val3":"",
                            "val4":"",
                            "val5":""
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
 checkPaymentPreActionData: function (req, res) {
      var token = this.getToken(req);
        var me = this;
        this.checkPaymentPreActionDataPost(req, token, function (data) {           
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": data});
        });
    },

    checkPaymentPreActionDataPost: function (req, token, cb) {
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
              helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/checkPaymentPreActionData', 'POST', req.headers),
                        { 
                        "tag1":d.tag1,
                        "tag3":d.tag3
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
                +  '  <link href="mgl/styles.css" rel="stylesheet"/>'
                +  '</head>'
                +  '<body>'
                + " <input type='hidden' id='paymentSuccessData' value='" + JSON.stringify(inpObj) + "' />" 
                +  '  <app-root></app-root>'
                +  '  <script type="text/javascript" src="mgl/inline.js"></script>'
                +  '  <script type="text/javascript" src="mgl/polyfills.js"></script>'
                +  '  <script type="text/javascript" src="mgl/scripts.js"></script>'
                +  '  <script type="text/javascript" src="mgl/vendor.js"></script>'
                +  '  <script type="text/javascript" src="mgl/main.js"></script>'
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
        +  '  <link href="mgl/styles.css" rel="stylesheet"/>'
        +  '</head>'
        +  '<body>'
        + " <input type='hidden' id='paymentFailureData' value='" + JSON.stringify(inpObj) + "' />" 
        +  '  <app-root></app-root>'
        +  '  <script type="text/javascript" src="mgl/inline.js"></script>'
        +  '  <script type="text/javascript" src="mgl/polyfills.js"></script>'
        +  '  <script type="text/javascript" src="mgl/scripts.js"></script>'
        +  '  <script type="text/javascript" src="mgl/vendor.js"></script>'
        +  '  <script type="text/javascript" src="mgl/main.js"></script>'
        +  '</body>'
        +  '</html>'    
        );

}
   
}

module.exports = benowCont;