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

var PdfTable = require('voilab-pdf-table')
var PDFDocument = require('pdfkit');

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

    /*    postImgToJSONAndCallback: function(extServerOptions, obj, cb) {
            var reqPost = http.request(extServerOptions, function (res) {
                var buffer = ''; 
                res.setEncoding(null);
                res.on('data', function (chunk) {
                    buffer += chunk;
                });
                res.on('end', function (err) {
                    if(res.statusCode === 200) {
                        var t = new Buffer(buffer).toString('base64');
                        cb({'src': 'data:image/png;base64,' + t});
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
        },*/

    cleanOldFiles: function () {
        try {
            var result = findRemoveSync('qrs', { age: { seconds: 3600 }, extensions: '.png' })
        }
        catch (err) {
        }
    },

    postSaveImgAndCallback: function (extServerOptions, obj, name, cb) {
        try {
            this.cleanOldFiles();
            var fileName = 'qrs/' + name + uuid.v1() + '.png';
            var f = fs.createWriteStream(fileName);
            var reqPost = http.request(extServerOptions, function (res) {
                var buffer = '';
                res.on('data', function (chunk) {
                    f.write(chunk);
                });
                res.on('end', function (err) {
                    if (res.statusCode === 200) {
                        f.end();
                        cb({ 'src': fileName });
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

    getTilExtServerOptions: function (path, method, token, email) {
        var extServerOptions = {
            host: config.beNowSvc.host,
            port: config.beNowSvc.port,
            path: path,
            method: method,
            headers: {}
        };

        extServerOptions.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36';
        extServerOptions.headers['Content-Type'] = 'application/json';
        extServerOptions.headers['X-AUTHORIZATION'] = token;
        extServerOptions.headers['X-EMAIL'] = email;
        return extServerOptions;
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

    getExtServerOptions: function (path, method, headers) {
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

        if (headers['X-EMAIL'])
            extServerOptions.headers['X-EMAIL'] = headers['X-EMAIL'];
        else if (headers['x-email'])
            extServerOptions.headers['X-EMAIL'] = headers['x-email'];

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

    deleteUploadedFile(fName, errMsg) {
        if (fs.existsSync(fName))
            fs.unlink(fName);

        res.send({ success: false, errorMsg: errMsg });
    },

    invalidFileSizeTypeDim2(req, res, cb) {
        var fp = __dirname + '/../../uploads/' + req.file.filename;
        var tp = fileType(readChunk.sync(fp, 0, 4100));
        if(!tp || !tp.ext || !(tp.ext.toLowerCase() == 'pdf' || tp.ext.toLowerCase() == 'png' || tp.ext.toLowerCase() == 'jpg' || tp.ext.toLowerCase() == 'jpeg')) 
            this.deleteUploadedFile(fp, 'Unsupported file format!');

        var stats = fs.statSync(fp);
        if(!stats || !stats.size || stats.size > 10000000) 
            this.deleteUploadedFile(fp, 'File is bigger than 300 KB!');//translates to 1 MB
        else
            cb();
    },

	invalidFileSizeTypeDim(req, res, cb) {
        var fp = __dirname + '/../../uploads/' + req.file.filename;
        var tp = fileType(readChunk.sync(fp, 0, 4100));
        if (!tp || !tp.ext || !(tp.ext.toLowerCase() == 'png' || tp.ext.toLowerCase() == 'jpg' || tp.ext.toLowerCase() == 'jpeg'))
            this.deleteUploadedFile(fp, 'Unsupported file format!');

        var stats = fs.statSync(fp);
        if (!stats || !stats.size || stats.size > 1000000)
            this.deleteUploadedFile(fp, 'File is bigger than 300 KB!');//translates to 1 MB

        var dimensions = sizeOf(fp);
        if (!dimensions || !dimensions.width || !dimensions.height || dimensions.width < 300 || dimensions.height < 200) {
            Jimp.read(fp, function (err, mktglg) {
                var rw = 1;
                if (dimensions.width < 300)
                    r = parseFloat(300 / dimensions.width);

                if (dimensions.height < 200 && r < 200 / dimensions.height)
                    r = parseFloat(200 / dimensions.height);

                var newW = parseInt(dimensions.width * r);
                var newH = parseInt(dimensions.height * r);
                if (newW < 300)
                    newW = 300;

                if (newH < 200)
                    newH = 200;

                mktglg.resize(newW, newH)
                    .write(fp, cb)
            });
        }
        else
            cb();
    },

    uploadFile2: function(req, res) {
        if(req.fileValidationError)
            res.send({success: false, errorMsg: req.fileValidationError });
        else { 
            var me = this;
            me.invalidFileSizeTypeDim2(req, res, function () {
               
                if(!req.body.headers || !req.body.headers)
                    res.send({ success: false, errorMsg: 'Improper request. Please try again.' });
                else if (!req.file || !req.file.filename)
                    res.send({ success: false, errorMsg: 'Unsupported file format, size or dimension!' });
                else {
                   var h = me.decryptPayLoad(req.body.headers, null, false);
                   
                        var d = me.decryptPayLoad(req.body.data,null,  false);
                        if(!d.sourceId || !d.sourceType || !d.documentName || !d.documentCode)
                            res.send({ success: false, errorMsg: 'Incorrect input!' });
                        else {                           
                            var f = req.file.filename;
                            var reqPost = request.post(me.getDefaultExtFileServerOptions(config.beNowSvc.https + config.beNowSvc.host 
                                + ':' + config.beNowSvc.port + '/merchants/document/uploadSelfRegMerchantDocument', 'POST', req.headers), 
                                function (err, resp, body) {
                                if (err)
                                    res.send({ success: false, errorMsg: 'Something went wrong. Please try again.' });
                                else {
                                    if(body) {
                                        var rb = JSON.parse(body);
                                        if(rb) 
                                            res.send({ success: true, fileName: f });
                                        else
                                            res.send({ success: false, errorMsg: 'Error in uploading file. Please try again.' });
                                    }
                                    else
                                        res.send({ success: false, errorMsg: 'Error in uploading file. Please try again.' });
                                }
                            });
                            var fName = f;
                            var li = f.lastIndexOf('.');
                            if(li > 0 && li < f.length);
                                fName = fName.substring(0, li);

                            var form = reqPost.form();
                        form.append('documentVO', JSON.stringify({
                            "sourceId": d.sourceId, "documentName": d.documentName, "sourceType": d.sourceType,
                            "documentCode": d.documentCode
                        }));
                            form.append('file', fs.createReadStream(__dirname + '/../../uploads/' + req.file.filename));
                        
                    }
                }
            });
        }
    },

    signUp: function(req, res) {
        var me = this;
        var token = this.getToken(req);
        this.signUpPost(req, token, function(data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({"data": me.encryptPayload(data, token, false)});
        });
    },

    sendVerifiedotp: function(req, res) {
        var me = this;
        var token = this.getToken(req);
        this.sendVerifiedotppost(req, token, function(data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({"data": me.encryptPayload(data, token, false)});            
        })
    },
          

    sendVerifiedotppost: function(req, token, cb) {
        var retErr = {
            "success": false,
            "error": true,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if(!req || !req.body || !req.body.data)
                cb(retErr);
            else {
                
                var d = this.decryptPayLoad(req.body.data, token, false); 
                if(d && d.mobileNumber && d.otp)
                    this.postAndCallback(this.getExtServerOptions('/payments/registration/checkWebOTP' , 'POST',  req.headers), 
                        {
                            "mobileNumber": d.mobileNumber,
                             "otp": d.otp
                        }, 
                        cb);
                         else cb(retErr);
            }
        }
        catch(err) {
            cb(retErr);
        }
    },
   getmerchantId: function(req, res) {
        var me = this;
        var token = this.getToken(req);
        this. getmerchantIdppost(req, token, function(data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({"data": me.encryptPayload(data, token, false)});            
        })
    },
          
          
    getmerchantIdppost: function(req, token, cb) {
        var retErr = {
            "success": false,
            "error": true,
            "errorCode": "Something went wrong. Please try again."
        };
        try {
            if(!req || !req.body || !req.body.data)
                cb(retErr);
            else {
                
                var d = this.decryptPayLoad(req.body.data, token, false); 
               
                if(d && d.mobileNumber )
                    this.postAndCallback(this.getExtServerOptions('/merchants/merchant/registerSelfMerchant' , 'POST',  req.headers), 
                        {
                           "userId":d.userId,
	                        "mobileNumber":d.mobileNumber,
	                        "emailId":d.emailId,
	                    	"password":d.password,
                            "businessName":d.businessName
                        }, 
                        cb);
                         else cb(retErr);
            }
        }
        catch(err) {
            cb(retErr);
        }
    },

    //TODO: Error handling.
    signUpPost: function(req, token, cb) {
        var retErr = {
            "success": false,
            "token": null,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
             if(!req || !req.body || !req.body.data) {
               cb(retErr);
            }
            else {
                       
                 var d = this.decryptPayLoad(req.body.data, token, false);
                 if(d && d.mobileNumber) {
                                    
                    this.postAndCallback(this.getExtServerOptions('/payments/registration/sendWebOTP','POST', req.headers), 
                        {
                            "mobileNumber": d.mobileNumber
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
    getBusinessType: function(req, res) { 
        var me = this;
        var token = this.getToken(req);
        this.getBusinessTypeget(req, token, function(data) {
            res.setHeader("X-Frame-Options", "DENY")
             res.json({"data": me.encryptPayload(data, token, false)});
        });
    },
    
    getBusinessTypeget: function(req,token, cb) {
       var retErr = {
            "success": false,
            "token": null,
            "errorCode": "Something went wrong. Please try again."
        }

        try { 
          this.getAndCallback(this.getExtServerOptions('/merchants/merchant/getAllBusinessTypes','GET', req.headers),cb);
        }
           
        catch(err) {
          cb(retErr);
        }
    },

   getBusinessDocumentList: function(req, res) {
        var me = this;
        var token = this.getToken(req);
        this.buisnesscodepost(req, token, function(data) {
            res.setHeader("X-Frame-Options", "DENY");
             res.json({"data": me.encryptPayload(data, token, false)});
        });
    },
    
   buisnesscodepost: function(req,token, cb) {
       var retErr = {
            "success": false,
            "token": null,
            "errorCode": "Something went wrong. Please try again."
        }

        try {
             if(!req || !req.body || !req.body.data) {
               cb(retErr);
            }
            else {
                       
                 var d = this.decryptPayLoad(req.body.data, token, false);

                 if(d && d.data) {                                
                    this.postAndCallback(this.getExtServerOptions('/merchants/merchant/getBusinessDocumentList','POST', req.headers), 
                        {
                            "data": d.data
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
    
    getDashboardCategories: function(req, res) {
            var me = this;
            var token = this.getToken(req);
            this.getDashboardCategoriespost(req, token, function(data) {
                res.setHeader("X-Frame-Options", "DENY");
                res.json({"data": me.encryptPayload(data, token, false)});
            });
        },
        
    getDashboardCategoriespost: function(req,token, cb) {
       var retErr = {
            "success": false,
            "token": null,
            "errorCode": "Something went wrong. Please try again."
        }

        try {
             if(!req || !req.body || !req.body.data) {
               cb(retErr);
            }
            else { 
               this.postAndCallback(this.getDefaultExtServerOptions('/payments/getDashboardCategories','POST', req.headers), 
                        { 

                           }, 
                        cb);
                }   
            }
        catch(err) {
           cb(retErr);
        }
    },

   getSubcategoryByCategory: function(req, res) {
            var me = this;
            var token = this.getToken(req);
            this.getSubcategoryByCategorypost(req, token, function(data) {
                res.setHeader("X-Frame-Options", "DENY");
                res.json({"data": me.encryptPayload(data, token, false)});
            });
        },
        
    getSubcategoryByCategorypost: function(req,token, cb) {
       var retErr = {
            "success": false,
            "token": null,
            "errorCode": "Something went wrong. Please try again."
        }

        try {
            if(!req || !req.body || !req.body.data) {
               cb(retErr);
            }
            else {
                       
                 var d = this.decryptPayLoad(req.body.data, token, false);
                if(d && d.category) {  
               this.postAndCallback(this.getDefaultExtServerOptions('/payments/getSubcategoryByCategory','POST', req.headers), 
                        { 
                            "category": d.category
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

 registerSelfMerchant: function(req, res) {
        var me = this;
        var token = this.getToken(req);
        this.registerSelfMerchantpost(req, token, function(data) {
            res.setHeader("X-Frame-Options", "DENY");
             res.json({"data": me.encryptPayload(data, token, false)});
        });
    },
    
   registerSelfMerchantpost: function(req,token, cb) {
       var retErr = {
            "success": false,
            "token": null,
            "errorCode": "Something went wrong. Please try again."
        }

        try {
             if(!req || !req.body || !req.body.data) {
               cb(retErr);
            }
            else {
                       
                var d = this.decryptPayLoad(req.body.data, token, false);
                if(d && d.id ) {
                         this.postAndCallback(this.getExtServerOptions('/merchants/merchant/registerSelfMerchant','POST', req.headers), 
                        {
                             "displayName":d.displayName,
                             "businessType": d.businessType,
                             "contactEmailId":d.contactEmailId,
                             "category": d.category,
	                         "subCategory":d.subCategory,
                             "city":d.city,
                             "locality":d.locality,
                             "contactPerson":d.contactPerson,
                             "contactMobileNumber":d.contactMobileNumber,
                             "address":d.address,
                             "pinCode":d.pinCode,
                             "businessTypeCode":d.businessTypeCode,
                             "id":d.id
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

   markSelfMerchantVerified: function(req, res) {
        var me = this;
        var token = this.getToken(req);
        this.markSelfMerchantVerifiedpost(req, token, function(data) {
            res.setHeader("X-Frame-Options", "DENY");
             res.json({"data": me.encryptPayload(data, token, false)});
        });
    },
    
   markSelfMerchantVerifiedpost: function(req,token, cb) {
       var retErr = {
            "success": false,
            "token": null,
            "errorCode": "Something went wrong. Please try again."
        }

        try {
             if(!req || !req.body || !req.body.data) {
               cb(retErr);
            }
            else {
                       
                 var d = this.decryptPayLoad(req.body.data, token, false);
                 if(d && d.id) {      
                    this.postAndCallback(this.getDefaultExtServerOptions('/merchants/merchant/markSelfMerchantVerified','POST', req.headers), 
                        {
                            "id": d.id , 
	                        "ifsc": d.ifsc ,
	                        "accountRefNumber": d.accountRefNumber,
                            "panNumber":d.panNumber,
	                        "bankName":d.bankName,
	                        "merchantName":d.merchantName
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

  getMerchantDetails: function(req, res) {
        var me = this;
        var token = this.getToken(req);
        this.MerchantDetailspost(req, token, function(data) {
            res.setHeader("X-Frame-Options", "DENY");
             res.json({"data": me.encryptPayload(data, token, false)});
        });
    },
    
   MerchantDetailspost: function(req,token, cb) {
       var retErr = {
            "success": false,
            "token": null,
            "errorCode": "Something went wrong. Please try again."
        }

        try {
             if(!req || !req.body || !req.body.data) {
               cb(retErr);
            }
            else {
                       
                 var d = this.decryptPayLoad(req.body.data, token, false);
                 if(d && d.merchantCode) {
                                    
                    this.postAndCallback(this.getDefaultExtServerOptions('/payments/merchantdetail/getMerchantDetails','POST', req.headers), 
                        {
                            "merchantCode":d.merchantCode
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

    sendEmailNotification: function (req, res) {
        var me = this;
        var token = this.getToken(req);
        this.sendEmailNotificationPost(req, token, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": me.encryptPayload(data, token, false) });
        });
    },

    createReceipt: function (req, res) {
        var me = this;
        var token = this.getToken(req);
        this.createReceiptPost(req, token, function (data) {
              
               res.setHeader("X-Frame-Options", "DENY");
               res.json({ "data": me.encryptPayload(data, token, false)
            });
        });
    },



    createReceiptPost: function (req, token, cb) {
        var retErr = {
            "success": false,
            "token": null,
            "errorCode": "Something went wrong. Please try again."
        }

        try {
            if (!req || !req.body || !req.body.data) {
                cb(retErr);
            }
            else {
                var d = this.decryptPayLoad(req.body.data, token, false);
                if (d) {
                    this.postAndCallback(this.getDefaultExtServerOptions('/merchants/merchant/createReceipt', 'POST', req.headers),
                        {
                            "amount": d.amount,
                            "paymentDate": d.paymentDate,
                            "payerName": d.payerName,
                            "payerUserId": d.payerUserId,
                            "merchanCode": d.merchanCode,
                            "txnId": d.txnId
                        },
                        cb);
                }
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    sendEmailNotificationPost: function (req, token, cb) {
        var retErr = {
            "success": false,
            "token": null,
            "errorCode": "Something went wrong. Please try again."
        }

        try {
            if (!req || !req.body || !req.body.data) {
                cb(retErr);
            }
            else {

                var d = this.decryptPayLoad(req.body.data, token, false);
                if (d) {
                    this.postAndCallback(this.getDefaultExtServerOptions('/merchants/merchant/sendEmailNotification', 'POST', req.headers),
                        {
                            "to": d.to,
                            "text": d.text,
                            "subject": d.subject,
                            "cc": d.cc,
                            "bcc": d.bcc
                        },
                        cb);
                }
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

   complteregister: function(req, res) {
        var me = this;
        var token = this.getToken(req);
        this.complteregistration(req, token, function(data) {
            res.setHeader("X-Frame-Options", "DENY");
             res.json({"data": me.encryptPayload(data, token, false)});
        });
    },
    
   complteregistration: function(req,token, cb) {
       var retErr = {
            "success": false,
            "token": null,
            "errorCode": "Something went wrong. Please try again."
        }

        try {
             if(!req || !req.body || !req.body.data) {
               cb(retErr);
            }
            else {
                       
                 var d = this.decryptPayLoad(req.body.data, token, false);
                 if(d && d.id) {
                    this.postAndCallback(this.getDefaultExtServerOptions('/merchants/merchant/completeRegistration', 'POST', req.headers),
                        {
                            "id": d.id
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

    uploadFile: function (req, res) {
        if (req.fileValidationError)
            res.send({ success: false, errorMsg: req.fileValidationError });
        else {
            var me = this;
            this.invalidFileSizeTypeDim(req, res, function () {
                if (!req.body.headers || !req.body.headers)
                    res.send({ success: false, errorMsg: 'Improper request. Please try again.' });
                else if (!req.file || !req.file.filename)
                    res.send({ success: false, errorMsg: 'Unsupported file format, size or dimension!' });
                else {
                    var h = me.decryptPayLoad(req.body.headers, null, false);
                    if (!h['X-AUTHORIZATION'])
                        res.send({ success: false, errorMsg: 'Unauthorized!' });
                    else {
                        var d = me.decryptPayLoad(req.body.data, h['X-AUTHORIZATION'], true);
                        if (!d.sourceId || !d.sourceType)
                            res.send({ success: false, errorMsg: 'Incorrect input!' });
                        else {
                            var f = req.file.filename;
                            var reqPost = request.post(me.getDefaultExtFileServerOptions(config.beNowSvc.https + config.beNowSvc.host
                                + ':' + config.beNowSvc.port + '/merchants/document/uploadMerchantDocument', 'POST', req.headers),
                                function (err, resp, body) {
                                    if (err)
                                        res.send({ success: false, errorMsg: 'Something went wrong. Please try again.' });
                                    else {
                                        if (body) {
                                            var rb = JSON.parse(body);
                                            if (rb && rb.createdByUser && rb.createdByUser.length > 0)
                                                res.send({ success: true, fileName: f });
                                            else
                                                res.send({ success: false, errorMsg: 'Error in uploading file. Please try again.' });
                                        }
                                        else
                                            res.send({ success: false, errorMsg: 'Error in uploading file. Please try again.' });
                                    }
                                });
                            var fName = f;
                            var li = f.lastIndexOf('.');
                            if (li > 0 && li < f.length);
                            fName = fName.substring(0, li);

                            var form = reqPost.form();
                            form.append('documentVO', JSON.stringify({
                                "sourceId": d.sourceId, "documentName": fName, "sourceType": d.sourceType,
                                "documentCode": req.file.originalname
                            }));
                            form.append('file', fs.createReadStream(__dirname + '/../../uploads/' + req.file.filename));
                        }
                    }
                }
            });
        }
    },

    getDefaultVPA: function (req, res) {
        var me = this;
        var token = this.getToken(req);
        this.getDefaultVPAGet(req, token, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": me.encryptPayload({ vpa: data }, token, false) });
        })
    },

    sendVerificationMail: function (req, res) {
        var me = this;
        var token = this.getToken(req);
        this.sendVerificationMailGet(req, token, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": me.encryptPayload(data, token, false) });
        })
    },

    getTillAssignments: function(req, res) {
        var retErr = {
            "success": false,
            "token": null,
            "errorCode": "Something went wrong. Please try again."
        };
        var token = this.getToken(req);
        var headers = req.headers;
        var me = this;
        if (!req || !req.body || !req.body.data) {
            cb(retErr);
        }
        else {
            var d = this.decryptPayLoad(req.body.data, token, false);              
            this.getTilsGet(d.email, d.merchantCode, token, 
                headers['X-EMAIL'] ? headers['X-EMAIL'] : headers['x-email'] ? headers['x-email'] : config.defaultEmail, function (data) {
                res.setHeader("X-Frame-Options", "DENY");
                res.json({ "data": me.encryptPayload(data, token, false) });
            });
        }
    },

    signIn: function (req, res) {
        var me = this;
        var token = this.getToken(req);
        var retErr = {
            "success": false,
            "token": null,
            "errorCode": "Something went wrong. Please try again."
        };
        if (!req || !req.body || !req.body.data) {
            cb(retErr);
        }
        else {
            var d = this.decryptPayLoad(req.body.data, token, false);              
            if (d && d.email && d.password) {
                this.signInPost(req, token, function (data) {
                    if (data && data.jwtToken) {
                        res.setHeader("X-Frame-Options", "DENY");
                        res.json({ "data": me.encryptPayload(data, token, false) });
                    }
                    else {
                        me.signInTilPost(req, token, function (empData) {
                            if (empData && empData.jwtToken && empData.employee_role && 
                                    (empData.employee_role.trim().toLowerCase() == 'benow merchant associate' 
                                    || empData.employee_role.trim().toLowerCase() == 'benow merchant manager'))  {
                                    var ts = empData.jwtToken.split('.');
                                    if (ts && ts.length > 1) {
                                        var dt = JSON.parse(atob(ts[1]));
                                        if (dt && dt.sub && dt.data) {
                                            me.getTilsGet(d.email, dt.data.merchantCode, empData.jwtToken, dt.sub, function (tilData) {
                                                empData.tils = tilData;
                                                res.setHeader("X-Frame-Options", "DENY");
                                                res.json({ "data": me.encryptPayload(empData, token, false) });
                                            });
                                        }
                                        else {
                                            res.setHeader("X-Frame-Options", "DENY");
                                            res.json({ "data": me.encryptPayload(empData, token, false) });
                                        }
                                    }
                                    else {
                                        res.setHeader("X-Frame-Options", "DENY");
                                        res.json({ "data": me.encryptPayload(empData, token, false) });
                                    }
                            }
                            else {
                                res.setHeader("X-Frame-Options", "DENY");
                                res.json({ "data": me.encryptPayload(empData, token, false) });
                            }
                        });
                    }
                });
            }
        }
    },

    download: function (req, res) {
        var me = this;
        var token = this.getToken(req);
        this.downloadPost(req, token, res, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": me.encryptPayload(data, token, true) });
        });
    },

    tillAllocate: function (req, res) {
        var me = this;
        var token = this.getToken(req);
        this.tillAllocatePost(req, token, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": me.encryptPayload(data, token, false) });
        });
    },

    getTicker: function (req, res) {
        var me = this;
        var token = this.getToken(req);
        this.getTickerPost(req, token, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": me.encryptPayload({ vpa: data }, token, true) });
        });
    },

    savePayerDetails: function (req, res) {
        var me = this;
        var token = this.getToken(req);
        this.savePayerDetailsPost(req, token, function (data) {
	    res.setHeader("X-Frame-Options", "ALLOW");
            res.json({ "data": me.encryptPayload(data, token, false) });
        });
    },

    tillRelease: function (req, res) {
        var me = this;
        var token = this.getToken(req);
        this.tillReleasePost(req, token, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": me.encryptPayload(data, token, false) });
        });
    },

    getDueInvoices: function (req, res) {
        var me = this;
        var token = this.getToken(req);
        this.getDueInvoicesPost(req, token, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": me.encryptPayload(data, token, true) });
        });
    },

    savePaymentLink: function (req, res) {
        var me = this;
        var token = this.getToken(req);
        var hdrs = req.headers;
        var d = this.decryptPayLoad(req.body.data, token, true);
        var merchantName = '';
        if (d && d.merchantName)
            merchantName = d.merchantName;

        this.savePaymentLinkPost(req, token, function (data) {
            if (data && data.paymentReqNumber && data.mobileNumber) {
                me.smsPaymentLinkPost(data.customerName, merchantName, d.mtype, data.mobileNumber, data.paymentReqNumber, hdrs, function (out) {
                    if (out === true) {
                        res.setHeader("X-Frame-Options", "DENY");
                        res.json({ "data": me.encryptPayload({ success: true }, token, true) });
                    }
                    else {
                        res.setHeader("X-Frame-Options", "DENY");
                        res.json({ "data": me.encryptPayload({ success: false, errorMsg: 'Error in sending payment link. Please try again.' }, token, true) });
                    }
                });
            }
            else {
                res.setHeader("X-Frame-Options", "DENY");
                res.json({ "data": me.encryptPayload({ success: false, errorMsg: 'Error in saving payment link. Please try again.' }, token, true) });
            }
        });
    },

    getDueMChequesByDate: function (req, res) {
        var me = this;
        var token = this.getToken(req);
        this.getDueMChequesByDatePost(req, token, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": me.encryptPayload(data, token, true) });
        });
    },

    getMCheques: function (req, res) {
        var me = this;
        var token = this.getToken(req);
        this.getMChequesPost(req, token, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": me.encryptPayload(data, token, true) });
        });
    },

    getPaymentSummary: function (req, res) {
        var me = this;
        var token = this.getToken(req);
        this.getPaymentSummaryPost(req, token, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": me.encryptPayload(data, token, true) });
        });
    },

    getMChequeDetails: function (req, res) {
        var me = this;
        var token = this.getToken(req);
        this.getMChequeDetailsPost(req, token, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": me.encryptPayload(data, token, true) });
        });
    },

    payWithMCheque: function (req, res) {
        var me = this;
        var token = this.getToken(req);
        this.payWithMChequePost(req, token, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": me.encryptPayload(data, token, true) });
        });
    },

    changePassword: function (req, res) {
        var me = this;
        var token = this.getToken(req);
        this.changePasswordPost(req, token, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": me.encryptPayload(data, token, false) });
        });
    },

    getAllNGOTransactions: function (req, res) {
        var me = this;
        var token = this.getToken(req);
        this.getAllNGOTransactionsGet(req, token, function (data) {
           
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": me.encryptPayload(data, token, true) });
        })
    },

    getAllPPLTransactions: function (req, res) {
        var me = this;
        var token = this.getToken(req);
        this.getAllPPLTransactionsPost(req, token, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": me.encryptPayload(data, token, false) });
        });
    },

    getAllTransactions: function (req, res) {
        var me = this;
        var token = this.getToken(req);
        this.getAllTransactionsPost(req, token, function (data) {
           
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": me.encryptPayload(data, token, false) });
        });
    },

    getTransactionStatusByRef: function(req, res) {
        var me = this;
        var token = this.getToken(req);
        this.getTransactionStatusByRefPost(req, token, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": me.encryptPayload(data, token, true) });
        });        
    },

    getTransactionStatus: function(req, res) {
        var me = this;
        var token = this.getToken(req);
        this.getTransactionStatusPost(req, token, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": me.encryptPayload(data, token, false) });
        });
    },

    getTransactions: function (req, res) {
        var me = this;
        var token = this.getToken(req);
        this.getTransactionsPost(req, token, function (data) {
           
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": me.encryptPayload(data, token, false) });
        });
    },

    getNotifications: function (req, res) {
        var me = this;
        var token = this.getToken(req);
        this.getNotificationsPost(req, token, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": me.encryptPayload(data, token, true) });
        });
    },

    getPPLTransactions: function (req, res) {
        var me = this;
        var token = this.getToken(req);
        this.getPPLTransactionsPost(req, token, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": me.encryptPayload(data, token, false) });
        });
    },

   fetchMerchantForEditDetails: function (req, res) {
        var me = this;
        var token = this.getToken(req);
        this.fetchMerchantForEditDetailsPost(req, token, function (data) {
           
            var p = data.documentResponseVO.documentList;
            if(p && p.length > 0 ) {
             for(var i=0 ; i< p.length; i++) {
                if(p[i].documentName =='Merchant_logo') 
                var logoURL = p[i].documentUrl;
            
              }
            }
           if(data && logoURL) {
                me.downloadLogo(logoURL, data.userId, function(ldata) {                   
                    data.merchantLogoUrl = ldata;
                    res.setHeader("X-Frame-Options", "DENY");
                    res.json({ "data": me.encryptPayload(data, token, false) });
                });
            }
            else {
                res.setHeader("X-Frame-Options", "DENY");
                res.json({ "data": me.encryptPayload(data, token, false) });
            }
        });
    },

    getPaymentDetails: function (req, res) {
        var me = this;
        var token = this.getToken(req);
        this.getPaymentDetailsPost(req, token, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": me.encryptPayload(data, token, false) });
        });
    },

    getLastRequest: function (req, res) {
        var me = this;
        var token = this.getToken(req);
        this.getLastRequestPost(req, token, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": me.encryptPayload(data, token, false) });
        });
    },

    sendCollectRequest: function (req, res) {
        var me = this;
        var token = this.getToken(req);
        this.sendCollectRequestPost(req, token, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": me.encryptPayload(data, token, false) });
        });
    },

    getDynamicQRString: function (req, res) {
        var me = this;
        var token = this.getToken(req);
        this.getDynamicQRStringPost(req, token, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": me.encryptPayload(data, token, false) });
        });
    },

    getDynamicQR: function (req, res) {
        var me = this;
        var token = this.getToken(req);
        this.getDynamicQRPost(req, token, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": me.encryptPayload(data, token, false) });
        });
    },
    
    
    getEmployeeDetails: function (req, res) {
        var me = this;
        var token = this.getToken(req);
        this.getEmployeeDetailsPost(req, token, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": me.encryptPayload(data, token, false) });
        });
    },

      getAllNGOTransactionsGet: function (req, token, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body || !req.body.data)
                cb(retErr);
            else {
                
                var d = this.decryptPayLoad(req.body.data, token, true);
               
                if (d && d.merchantCode)
                    this.postAndCallback(this.getExtServerOptions('/payments/paymentadapter/getDataByPaymentLinkByCriteria',
                        'POST', req.headers),
                        {
                            "merchantCode": d.merchantCode,
                            "fromDate": d.fromDate,
                            "toDate": d.toDate
                        }, cb);
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    //TODO: Error handling.
    sendVerificationMailGet: function (req, token, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body || !req.body.data)
                cb(retErr);
            else {
                var d = this.decryptPayLoad(req.body.data, token, false);
                if (d && d.email)
                    this.getAndCallback(this.getExtServerOptions('/merchants/merchant/recoverPassword/' + d.email,
                        'GET', req.headers), cb);
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    getDefaultVPAGet: function (req, token, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body || !req.body.data)
                cb(retErr);
            else {
                var d = this.decryptPayLoad(req.body.data, token, false);
                if (d && d.merchantCode) {
                    var gurl = '/merchants/merchant/getDefaultVPA?merchantCode=' + d.merchantCode;
                    if (d.til)
                        gurl += '&till=' + d.til;

                    this.getAndCallback(this.getExtServerOptions(gurl, 'GET', req.headers), cb, true);
                }
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    getTilsGet: function (login, merchantCode, token, email, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!merchantCode || !token)
                cb(retErr);
            else
                this.getAndCallback(this.getTilExtServerOptions('/merchants/merchant/getMerchantTills?merchantCode=' +
                    merchantCode + '&userId=' + login, 'GET', token, email), cb);
        }
        catch (err) {
            cb(retErr);
        }
    },

    getDynamicQRStringPost: function (req, token, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body || !req.body.data) {
                cb(retErr);
            }
            else {
                var d = this.decryptPayLoad(req.body.data, token, false);
                if (d) {
                    var obj = {
                        "merchantCode": d.merchantCode,
                        "amount": d.amount,
                        "paymentMethod": "UPI",
                        "remarks": "",
                        "refNumber": ""
                    }
                    if (d.tr)
                        obj.refNumber = d.tr;

                    if (d.til)
                        obj.till = d.til;

                    this.postAndCallbackString(this.getDefaultExtServerOptions('/merchants/merchant/getDynamicQRString', 'POST', req.headers), obj, cb);
                }
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    //TODO: Error handling.
    getDynamicQRPost: function (req, token, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body || !req.body.data) {
                cb(retErr);
            }
            else {
                var d = this.decryptPayLoad(req.body.data, token, false);
                if (d) {
                    var obj = {
                        "merchantCode": d.merchantCode,
                        "amount": d.amount,
                        "paymentMethod": "UPI",
                        "remarks": "",
                        "refNumber": ""
                    };
                    if (d.tr)
                        obj.refNumber = d.tr;

                    if (d.til)
                        obj.till = d.til;

                    this.postSaveImgAndCallback(this.getDefaultExtServerOptions('/merchants/merchant/getDynamicQRCode',
                        'POST', req.headers), obj, d.merchantCode, cb);
                }
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    //changes
    getEmployeeDetailsPost: function (req, token, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body || !req.body.data) {
                cb(retErr);
            }
            else {
                var d = this.decryptPayLoad(req.body.data, token, false);
                if (d) {
                    var obj = {
                        "merchantCode": d.merchantCode
                    };
                    
                    this.postAndCallback(this.getDefaultExtServerOptions('/merchants/merchant/getEmployeeDetails',
                        'POST', req.headers), obj, cb);
                }
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    //TODO: Error handling.
    sendCollectRequestPost: function (req, token, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body || !req.body.data) {
                cb(retErr);
            }
            else {
                var d = this.decryptPayLoad(req.body.data, token, false);
                if (d && d.merchantCode) {
                    var obj = {
                        "merchantCode": d.merchantCode,
                        "payerVA": d.payerVA,
                        "amount": d.amount.toString(),
                        "expiryValue": d.expiryValue.toString(),
                        "expiryType": d.expiryType,
                        "remarks": d.remarks,
                        "paymentMethod": "UPI",
                        "refNumber": ""
                    };
                    if (d.tr)
                        obj.refNumber = d.tr;

                    if (d.til)
                        obj.till = d.til;

                    this.postAndCallback(this.getDefaultExtServerOptions('/payments/paymentadapter/MerchantCollectRequest',
                        'POST', req.headers), obj, cb);
                }
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    //TODO: Error handling.
    getLastRequestPost: function (req, token, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body || !req.body.data) {
                cb(retErr);
            }
            else {
                var d = this.decryptPayLoad(req.body.data, token, false);
                if (d && d.merchantId) {
                    this.postAndCallback(this.getExtServerOptions('/payments/paymentadapter/getLastCollectRequest',
                        'POST', req.headers),
                        {
                            "merchantId": d.merchantId
                        },
                        cb);
                }
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    //TODO: Error handling.
    getPaymentDetailsPost: function (req, token, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body || !req.body.data) {
                cb(retErr);
            }
            else {
                var d = this.decryptPayLoad(req.body.data, token, false);
                if (d && d.hdrTxnRefNumber) {
                    this.postAndCallback(this.getExtServerOptions('/merchants/merchant/paymentHistory/getPaymentHistoryDtl',
                        'POST', req.headers),
                        {
                            "hdrTxnRefNumber": d.hdrTxnRefNumber
                        },
                        cb);
                }
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    accumulatePPLResults: function (merchantCode, fromDate, toDate, page, payments, optns, cb, retV) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };
        try {
            if (retV && retV.success !== false) {
                if (retV.orders && retV.orders.length > 0) {
                    if (!payments)
                        payments = new Array();

                    for (var i = 0; i < retV.orders.length; i++)
                        payments.push(retV.orders[i]);

                    if (retV.noOfPages > page && payments.length < 1000) {
                        var me = this;
                        page++;
                        this.postAndCallback(optns,
                            {
                                "merchantCode": merchantCode,
                                "fromDate": fromDate,
                                "toDate": toDate,
                                "pageNumber": page
                            },
                            function (retVal) {
                                me.accumulatePPLResults(merchantCode, fromDate, toDate, page, payments, optns, cb, retVal);
                            });
                    }
                    else {
                        retV.orders = payments;
                        cb(retV);
                    }
                }
                else
                    cb(retV);
            }
            else
                cb(retErr);
        }
        catch (err) {
            cb(retErr);
        }
    },

    accumulateResults: function (merchantCode, fromDate, toDate, page, payments, optns, cb, retV) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };
        try {
            if (retV && retV.success !== false) {
                if (retV.orders && retV.orders.length > 0) {
                    if (!payments)
                        payments = new Array();

                    for (var i = 0; i < retV.orders.length; i++)
                        payments.push(retV.orders[i]);

                    if (retV.noOfPages > page && payments.length < 1000) {
                        var me = this;
                        page++;
                        this.postAndCallback(optns,
                            {
                                "merchantCode": merchantCode,
                                "fromDate": fromDate,
                                "toDate": toDate,
                                "pageNumber": page
                            },
                            function (retVal) {
                                me.accumulateResults(merchantCode, fromDate, toDate, page, payments, optns, cb, retVal);
                            });
                    }
                    else {
                        retV.orders = payments;
                        cb(retV);
                    }
                }
                else
                    cb(retV);
            }
            else
                cb(retErr);
        }
        catch (err) {
            cb(retErr);
        }
    },

    getAllPPLTransactionsPost: function (req, token, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };
        var me = this;
        var payments = new Array();

        try {
            if (!req || !req.body || !req.body.data) {
                cb(retErr);
            }
            else {
                var d = this.decryptPayLoad(req.body.data, token, false);
                if (d) {
                    var optns = this.getDefaultExtServerOptions('/merchants/merchant/getFulfilledMerchantOrders',
                        'POST', req.headers);
                    this.postAndCallback(optns,
                        {
                            "merchantCode": d.merchantCode,
                            "fromDate": d.fromDate,
                            "toDate": d.toDate,
                            "pageNumber": 1
                        },
                        function (retV) {
                            me.accumulatePPLResults(d.merchantCode, d.fromDate, d.toDate, 1, payments, optns, cb, retV);
                        });
                }
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    //TODO: Error handling.
    getAllTransactionsPost: function (req, token, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };
        var me = this;
        var payments = new Array();

        try {
            if (!req || !req.body || !req.body.data) {
                cb(retErr);
            }
            else {
                var d = this.decryptPayLoad(req.body.data, token, false);
              
                if (d) {
                    var optns = this.getExtServerOptions('/merchants/merchant/getFulfilledMerchantOrders',
                        'POST', req.headers);
                    this.postAndCallback(optns,
                        {
                            "merchantCode": d.merchantCode,
                            "fromDate": d.fromDate,
                            "toDate": d.toDate,
                            "pageNumber": 1
                        },
                        function (retV) {
                            me.accumulateResults(d.merchantCode, d.fromDate, d.toDate, 1, payments, optns, cb, retV);
                        });
                }
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    fetchMerchantForEditDetailsPost: function (req, token, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            
            if (!req || !req.body || !req.body.data)
          
                cb(retErr);
            else {
               
                var d = this.decryptPayLoad(req.body.data, token, false);
              
                if (d)
                    this.postAndCallback(this.getDefaultExtServerOptions('/merchants/merchant/fetchMerchantForEditDetails', 'POST', req.headers),
                        {
                            "userId":d.userId,
                            "sourceId":d.sourceId,
                            "sourceType": d.sourceType
                        }, cb);
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    getPPLTransactionsPost: function (req, token, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body || !req.body.data) {
                cb(retErr);
            }
            else {
                var d = this.decryptPayLoad(req.body.data, token, false);
                if (d) {
                    var obj = {
                        "merchantCode": d.merchantCode,
                        "fromDate": d.fromDate,
                        "toDate": d.toDate,
                        "pageNumber": d.pageNumber
                    };
                    if (d.merchantTill)
                        obj.merchantTill = d.til;

                    this.postAndCallback(this.getDefaultExtServerOptions('/merchants/merchant/getFulfilledMerchantOrders', 'POST', req.headers), obj, cb);
                }
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    getNotificationsPost: function (req, token, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body || !req.body.data)
                cb(retErr);
            else {
                var d = this.decryptPayLoad(req.body.data, token, true);
                if (d && d.merchantCode)
                    this.postAndCallback(this.getExtServerOptions('/merchants/merchant/getMerchantMsgList', 'POST', req.headers),
                        {
                            "merchantCode": d.merchantCode,
                            "pageNumber": d.pageNumber
                        }, cb);
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    getTransactionStatusByRefPost: function(req, token, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body || !req.body.data) {
                cb(retErr);
            }
            else {
                var d = this.decryptPayLoad(req.body.data, token, true);
                if (d && d.merchantCode && d.tr)
                    this.postAndCallback(this.getDefaultExtServerOptions('/payments/ecomm/getMerchantTransactionStatus', 'POST', req.headers), 
                        {
                            "merchantCode": d.merchantCode,
                            "refNumber": d.tr
                        }, cb);
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    getTransactionStatusPost: function(req, token, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body || !req.body.data) {
                cb(retErr);
            }
            else {
                var d = this.decryptPayLoad(req.body.data, token, false);
                if (d && d.merchantCode && d.txnId)
                    this.postAndCallback(this.getDefaultExtServerOptions('/payments/ecomm/getMerchantTransactionStatus', 'POST', req.headers), 
                        {
                            "merchantCode": d.merchantCode,
                            "txnId": d.txnId
                        }, cb);
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    //TODO: Error handling.
    getTransactionsPost: function (req, token, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body || !req.body.data) {
                cb(retErr);
            }
            else {
                var d = this.decryptPayLoad(req.body.data, token, false);
                if (d) {
                    var obj = {
                        "merchantCode": d.merchantCode,
                        "fromDate": d.fromDate,
                        "toDate": d.toDate,
                        "pageNumber": d.pageNumber,
                        "status":d.status,
                        "sortColumn":d.sortColumn,
                        "sortDirection":d.sortDirection
                    };
                  if (d.merchantTill)
                        obj.merchantTill = d.merchantTill;

 
                    this.postAndCallback(this.getExtServerOptions('/merchants/merchant/getFulfilledMerchantOrders', 'POST', req.headers), obj, cb);
                }
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    //TODO: Error handling.
    changePasswordPost: function (req, token, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body || !req.body.data) {
                cb(retErr);
            }
            else {
                var d = this.decryptPayLoad(req.body.data, token, false);
                if (d && d.email && d.password && d.verificationCode) {
                    this.postAndCallback(this.getExtServerOptions('/merchants/merchant/forgotPassword', 'POST',
                        req.headers),
                        {
                            "userId": d.email,
                            "verificationCode": d.verificationCode,
                            "newPassword": d.password
                        },
                        cb);
                }
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    getDueMChequesByDatePost: function (req, token, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body || !req.body.data) {
                cb(retErr);
            }
            else {
                var d = this.decryptPayLoad(req.body.data, token, true);
                if (d && d.email)
                    this.postAndCallback(this.getExtServerOptions('/merchants/distributor/getDueChequeDtl', 'POST',
                        req.headers),
                        {
                            "merchantUserId": d.email,
                            "dueDate": d.dueDate,
                            "status": d.status,
                            "pageNumber": d.pageNumber
                        }, cb);
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    getPaymentSummaryPost: function (req, token, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body || !req.body.data) {
                cb(retErr);
            }
            else {
                var d = this.decryptPayLoad(req.body.data, token, true);
                if (d)
                    this.postAndCallback(this.getExtServerOptions('/merchants/distributor/getInvoicesForChequeStatus', 'POST', req.headers),
                        {
                            "fromDate": d.fromDate,
                            "toDate": d.toDate,
                            "chequeStatus": d.chequeStatus,
                            "userId": d.userId
                        }, cb);
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    getMChequesPost: function (req, token, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body || !req.body.data) {
                cb(retErr);
            }
            else {
                var d = this.decryptPayLoad(req.body.data, token, true);
                if (d && d.email) {
                    var iObj = {
                        "merchantUserId": d.email,
                        "pageNumber": d.pageNumber
                    }
                    if (d.status)
                        iObj.status = d.status;

                    this.postAndCallback(this.getExtServerOptions('/merchants/distributor/fetchTransactionSummary', 'POST',
                        req.headers), iObj, cb);
                }
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    payWithMChequePost: function (req, token, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body || !req.body.data) {
                cb(retErr);
            }
            else {
                var d = this.decryptPayLoad(req.body.data, token, true);
                if (d)
                    this.postAndCallback(this.getExtServerOptions('/merchants/distributor/payWithMCheque', 'POST',
                        req.headers), d, cb);
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    getMChequeDetailsPost: function (req, token, cb) {
        var retErr = {
            "success": false,
            "token": null,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body || !req.body.data) {
                cb(retErr);
            }
            else {
                var d = this.decryptPayLoad(req.body.data, token, true);
                if (d && d.chequeNumber) {
                    this.postAndCallback(this.getExtServerOptions('/merchants/distributor/getMChequeDtls',
                        'POST', req.headers),
                        {
                            "chequeNumber": d.chequeNumber
                        }, cb);
                }
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    smsPaymentLinkPost: function (name, merchant, mtype, phone, txnId, hdrs, cb) {
        var retErr = {
            "success": false,
            "token": null,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (mtype == 2) {
                if (!name)
                    name = 'Donor';

                this.postAndCallback(this.getExtServerOptions('/merchants/merchant/sendMerchantSMS?mobileNumber=' + phone + '&message=' +
                    encodeURI('Dear Donor, To contribute ' + merchant + ', please click on ' + config.me + '/pay/' + txnId),
                    'POST', hdrs), null, cb);
            }
            else {
                if (!name)
                    name = 'Customer';

                this.postAndCallback(this.getExtServerOptions('/merchants/merchant/sendMerchantSMS?mobileNumber=' + phone + '&message=' +
                    encodeURI('Dear Customer, To pay ' + merchant + ', please click on ' + config.me + '/pay/' + txnId),
                    'POST', hdrs), null, cb);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    getPaymentLinkData: function (id, cb) {
        var retErr = {
            "success": false,
            "token": null,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            //TODO: Remove authentication once service is corrected.
            var hdrs = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
                'X-AUTHORIZATION': 'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vd3d3LmJlbm93LmluLyIsInN1YiI6ImprZ3Rlc3RAZ21haWwuY29tIiwiZGF0YSI6eyJtY2NDb2RlIjoiODY3NSIsIm1lcmNoYW50Q29kZSI6IkFBM1A5IiwicHJpdmF0ZUlkIjoiMjQ2IiwibWVyY2hhbnRJZCI6IjIzMCIsImRpc3BsYXlOYW1lIjoiRlFUIFRlc3RpbmcgTmFtZSIsIm1vYmlsZU51bWJlciI6Ijk4MjA0MDcxOTAifSwiaWF0IjoxNDkzMDMzMjU1fQ.B1TXsjo2uXsxg1-B_KIs9DQXy0L-fwZyByVRJKezX3A',
                'X-EMAIL': 'xy@mastek.com'
            };

            this.getAndCallback(this.getExtServerOptions('/payments/paymentadapter/getPortablePaymentRequest?txnRef=' + id, 'GET', hdrs), cb);
        }
        catch (err) {
            cb(retErr);
        }
    },

    downloadLogo: function(url, userId, cb) {
      
        try {
            if(!url)
                cb('');
            else {
                var extn = '.png';
                var lIndex = url.lastIndexOf('.');
                if(lIndex > 0)
                    extn = url.substring(lIndex);

               var fName = 'logos/' + userId + extn;
              
               if(!fs.existsSync(fName)) {
               var file = fs.createWriteStream(fName);
                    
            Jimp.read(config.beNowSvc.https + config.beNowSvc.host + ':' + config.beNowSvc.port + '/merchants/'
                        + url, function (err, lenna) {
                              lenna.resize(190, 105)       
                              var image = new Jimp(210, 120, function (err, image) {
                              image.background(0xFFFFFFFF)
                             .composite(lenna, 10, 5);
                               image.write(fName)
                              
                            cb(fName);
                        });                    
                   });

                }
                else
                    cb(fName);
            }
        }
        catch(err) {
            cb('');
        }
    },

    downloadPost: function (req, token, res, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };
        try {
            if (!req || !req.body || !req.body.data) {
                cb(retErr);
            }
            else {
                var d = this.decryptPayLoad(req.body.data, token, true);
                if (d && d.fileUrl) {
                    var tempFileUrl = uuid.v1() + d.fileUrl.substring(d.fileUrl.lastIndexOf('/') + 1);
                    var file = fs.createWriteStream('qrs/' + tempFileUrl);
                    var request = http.get(config.beNowSvc.https + config.beNowSvc.host + ':' + config.beNowSvc.port +
                        '/merchants' + d.fileUrl, function (response) {
                            response.pipe(file);
                            cb(config.me + '/qrs/' + tempFileUrl);
                        });
                }
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    downloadIfNotPresent: function (fileUrl, sourceId, cb) {
        var retErr = {
            "success": false,
            "token": null,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!fileUrl || !sourceId)
                cb('');
            else if (fs.existsSync('uploads/' + fileUrl))
                cb(config.me + '/uploads/' + fileUrl);
            else {
                var file = fs.createWriteStream('uploads/' + fileUrl);
                var request = http.get(config.beNowSvc.https + config.beNowSvc.host + ':' + config.beNowSvc.port +
                    '/merchants/merchant/document/' + sourceId + '/' + fileUrl, function (response) {
                        response.pipe(file);
                        cb(config.me + '/uploads/' + fileUrl);
                    });
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    savePaymentLinkPost: function (req, token, cb) {
        var retErr = {
            "success": false,
            "token": null,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body || !req.body.data) {
                cb(retErr);
            }
            else {
                var d = this.decryptPayLoad(req.body.data, token, true);
                if (d && d.mobileNumber && d.merchantCode) {
                    var expDt = d.expiryDate;
                    if (expDt && expDt.length > 9) {
                        var spExDt = expDt.split('-');
                        if (spExDt && spExDt.length > 2)
                            expDt = spExDt[2] + '-' + spExDt[1] + '-' + spExDt[0];
                    }

                    this.postAndCallback(this.getExtServerOptions('/payments/paymentadapter/portablePaymentRequest',
                        'POST', req.headers),
                        {
                            "merchantCode": d.merchantCode,
                            "mtype": d.mtype,
                            "customerName": d.customerName,
                            "mobileNumber": d.mobileNumber,
                            "amount": d.invoiceAmount,
                            "totalbudget": d.campaignTarget,
                            "description": d.description,
                            "fileURL": d.fileURL,
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
                            "panaccepted": d.panaccepted,
                            "mndpan": d.mndpan,
                            "minpanamnt": d.minpanamnt,
                            "askresidence": d.askresidence
                        }, cb);
                }
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    getDueInvoicesPost: function (req, token, cb) {
        var retErr = {
            "success": false,
            "token": null,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body || !req.body.data) {
                cb(retErr);
            }
            else {
                var d = this.decryptPayLoad(req.body.data, token, true);
                if (d && d.email) {
                    var iObj = {
                        "userId": d.email,
                        "dueDate": d.dueDate,
                        "sortColumn": d.sortBy,
                        "sortDirection": d.sortDirection,
                        "pageNumber": d.page,
                        "distributorName": d.distributor,
                        "invoiceNumber": d.invoiceNumber
                    };

                    this.postAndCallback(this.getExtServerOptions('/merchants/distributor/fetchDistributorInvoice',
                        'POST', req.headers), iObj, cb);
                }
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    signInTilPost: function (req, token, cb) {
        var retErr = {
            "success": false,
            "token": null,
            "errorCode": "Something went wrong. Please try again."
        };
        try {
            if (!req || !req.body || !req.body.data) {
                cb(retErr);
            }
            else {
                var d = this.decryptPayLoad(req.body.data, token, false);
                if (d && d.email && d.password) {
                    this.postAndCallback(this.getExtServerOptions('/merchants/merchant/empWebLogin', 'POST', req.headers),
                        {
                            "usercode": d.email,
                            "password": d.password
                        },
                        cb);
                }
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    tillReleasePost: function (req, token, cb) {
        var retErr = {
            "success": false,
            "token": null,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body || !req.body.data) {
                cb(retErr);
            }
            else {
                var d = this.decryptPayLoad(req.body.data, token, false);
                if (d && d.till && d.merchantCode) {
                    this.postAndCallback(this.getExtServerOptions('/merchants/merchant/releaseTill', 'POST', req.headers),
                        {
                            "till": d.till,
                            "merchantCode": d.merchantCode
                        },
                        cb);

                }
                else
                    cb(retErr);
            }
        }
        catch (err) {

            cb(retErr);
        }
    },

    savePayerDetailsPost: function (req, token, cb) {
        var retErr = {
            "success": false,
            "token": null,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body || !req.body.data) {
                cb(retErr);
            }
            else {
                var d = this.decryptPayLoad(req.body.data, token, false);
                if (d && d.mobileNo && d.name && d.email) {
                    this.postAndCallback(this.getDefaultExtServerOptions('/payments/paymentadapter/getPpPayer', 'POST', req.headers),
                        {
                            "name": d.name,
                            "address": d.address ? d.address : '',
                            "email": d.email,
                            "mobileNo": d.mobileNo,
                            "pancard": d.pan,
                            "residenceCountry": d.resident,
                            "transactionRef": d.transactionRef,
                            "paymentLinkRef": d.paymentLinkRef,
                            "merchantCode": d.merchantcode,
                            "amount": d.payamount,
                            "txnDate": me.getCurDateTimeString
                        },
                        cb);

                }
                else
                    cb(retErr);
            }
        }
        catch (err) {

            cb(retErr);
        }
    },

    getTickerPost: function (req, token, cb) {
        var retErr = {
            "success": false,
            "token": null,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body || !req.body.data) {
                cb(retErr);
            }
            else {
                var d = this.decryptPayLoad(req.body.data, token, true);
                if (d && d.paramType && d.paramCode) {
                    this.postAndCallback(this.getExtServerOptions('/merchants/merchant/getParameters', 'POST', req.headers),
                        {
                            "paramType": d.paramType,
                            "paramCode": d.paramCode
                        },
                        cb);

                }
                else
                    cb(retErr);
            }
        }
        catch (err) {

            cb(retErr);
        }
    },

    //TODO: Error handling.
    tillAllocatePost: function (req, token, cb) {
        var retErr = {
            "success": false,
            "token": null,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body || !req.body.data) {
                cb(retErr);
            }
            else {
                var d = this.decryptPayLoad(req.body.data, token, false);
                if (d && d.till && d.employeeUserCode && d.merchantCode) {
                    this.postAndCallback(this.getExtServerOptions('/merchants/merchant/allocateToTill', 'POST', req.headers),
                        {
                            "till": d.till,
                            "merchantCode": d.merchantCode,
                            "employeeUserCode": d.employeeUserCode
                        },
                        cb);

                }
                else
                    cb(retErr);
            }
        }
        catch (err) {

            cb(retErr);
        }
    },

    signInPost: function (req, token, cb) {
        var retErr = {
            "success": false,
            "token": null,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body || !req.body.data) {
                cb(retErr);
            }
            else {
                var d = this.decryptPayLoad(req.body.data, token, false);    
                if (d && d.email && d.password) {
                    this.postAndCallback(this.getExtServerOptions('/merchants/merchant/bizWebLogin', 'POST', req.headers),
                        {
                            "userId": d.email,
                            "password": d.password
                        },
                        cb);
                }
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    dt1Greater: function (dt1, dt2) {
        if (dt1 && dt2) {
            var ldt1 = dt1.split('-');
            var ldt2 = dt2.split('-');
            if (ldt1 && ldt2 && ldt1.length > 2 && ldt2.length > 2) {
                if (+ldt1[2] > +ldt2[2])
                    return true;
                else if (+ldt1[2] == +ldt2[2]) {
                    if (+ldt1[1] > +ldt2[1])
                        return true;
                    else if (+ldt1[1] == +ldt2[1]) {
                        if (+ldt1[0] > +ldt2[0])
                            return true;
                    }
                }
            }
        }

        return false;
    },

    getCurDateTimeString() {
        var dt = new Date();
        var dtStr = this.getCurDateString() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();
    },

    getCurDateString() {
        var dt = new Date();
        return this.getDate(dt.getDate()) + '-' + this.getMonth(dt.getMonth()) + '-' + dt.getFullYear();
    },

    getMonth(m) {
        var mon = parseInt(m, 10) + 1;
        if (mon < 10)
            return '0' + mon.toString();

        return mon.toString();
    },

    getDate(d) {
        if (parseInt(d, 10) < 10)
            return '0' + d.toString();

        return d.toString();
    },

    startPaymentProcess: function (req, res) {
        var paylinkid = '0';
        var me = this;
        var hdrs = req.headers;
        try {
            var headers = {
                'X-AUTHORIZATION': config.paymentGateway.xauth,
                'Content-Type': 'application/json'
            };
            var token = this.getToken(req);
            var d = this.decryptPayLoad(req.body.data, token, false);
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
                this.postAndCallback(this.getDefaultExtServerOptions('/payments/paymentadapter/checkPayer', 'POST', headers),
                    {
                        "userId": mobileNo
                    },
                    function (uData) {
                        if (uData && uData.responseFromAPI == true) {
                            me.postAndCallback(me.getDefaultExtServerOptions('/payments/paymentadapter/initiatePayWebRequest', 'POST', headers), obj,
                                function (data) {
                                    if (data && data.hdrTransRefNumber) {
                                        var s = pCache.set(data.hdrTransRefNumber, c);
                                        me.postAndCallback(me.getDefaultExtServerOptions('/payments/paymentadapter/getPpPayer', 'POST', hdrs),
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
	res.setHeader("X-Frame-Options", "ALLOW");
                                                res.json({ "data": me.encryptPayload({ "transactionRef": data.hdrTransRefNumber }, token, false) });
                                            });
                                    }
                                    else {
	res.setHeader("X-Frame-Options", "ALLOW");
                                        res.redirect(config.me + '/paymentfailure/' + paylinkid);
                                    }
                                });
                        }
                        else {
	res.setHeader("X-Frame-Options", "ALLOW");
                            res.redirect(config.me + '/paymentfailure/' + paylinkid);
                        }
                    });
            }
            else {
	res.setHeader("X-Frame-Options", "ALLOW");
                res.redirect(config.me + '/paymentfailure/' + paylinkid);
            }
        }
        catch (err) {
	res.setHeader("X-Frame-Options", "ALLOW");
            res.redirect(config.me + '/paymentfailure/' + paylinkid);
        }
    },

    processPayment: function (req, res) {
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
            var surl = config.paymentGateway.surl + paylinkid;
            var furl = config.paymentGateway.furl + paylinkid;
            if (req.body.sourceId == 2) {
                surl = req.body.surl;
                furl = req.body.furl;
            }
            else if (req.body.sourceId == 1) {
                surl = config.paymentGateway.sdksurl + paylinkid;
                furl = config.paymentGateway.sdkfurl + paylinkid;                
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
                "udf2": req.body.udf2,
                "udf3": req.body.udf3,
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
                "email": req.body.email ? req.body.email : "",
                "user_credentials": config.paymentGateway.key + ':' + req.body.mobileNo
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
            this.hashPayloadPost(paylinkid, obj, headers, payload, this.getDefaultExtServerOptions, this.postAndCallback, res);
        }
        catch (err) {
	res.setHeader("X-Frame-Options", "ALLOW");
            res.redirect(config.me + '/paymentfailure/' + paylinkid);
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
                                    if (err) {
                                        rd.setHeader("X-Frame-Options", "DENY");
                                        rd.redirect(config.me + '/paymentfailure/' + paylinkid);
                                    }

                                    if (remoteResponse && remoteResponse.caseless && remoteResponse.caseless.dict) {
                                        rd.redirect(remoteResponse.caseless.dict.location);
                                    }
                                    else {
                                        rd.setHeader("X-Frame-Options", "DENY");
                                        rd.redirect(config.me + '/paymentfailure/' + paylinkid);
                                    }
                                }
                                catch (error) {
                                    rd.setHeader("X-Frame-Options", "DENY");
                                    rd.redirect(config.me + '/paymentfailure/' + paylinkid);
                                }
                            });
                    }
                    else {
                        rd.setHeader("X-Frame-Options", "DENY");
                        rd.redirect(config.me + '/paymentfailure/' + paylinkid);
                    }
                });
        }
        catch (err) {
            rd.setHeader("X-Frame-Options", "DENY");
            rd.redirect(config.me + '/paymentfailure/' + paylinkid);
        }
    },

    savePaymentFailure: function (req, cb) {
        try {
            var pc = pCache.get(req.body.txnid);
            if (!pc || !pc.merchantCode) {
	res.setHeader("X-Frame-Options", "ALLOW");
                cb();
            }
            else {
                var headers = {
                    'X-AUTHORIZATION': config.defaultToken,
                    'Content-Type': 'application/json'
                };
                var pmtype = 'DEBIT_CARD';
                if (req.body.mode === 'CC')
                    pmtype = 'CREDIT_CARD';
                else if (req.body.mode === 'NB')
                    pmtype = 'NET_BANKING';

                this.postAndCallback(this.getDefaultExtServerOptions('/payments/paymentadapter/payWebRequest', 'POST', headers),
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
                                    "merchantCode": pc.merchantCode,
                                    "merchantName": pc.merchantName,
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
                                    "transactionStatus": req.body.status
                                }
                            }
                        ]
                    },
                    cb);
            }
        }
        catch (err) {
            cb();
        }
    },

    validateMerchantHash: function (payload, merchantCode, hash, cb) {
        try {
            var headers = {
                'X-AUTHORIZATION': config.defaultToken,
                'Content-Type': 'application/json'
            };

            this.postAndCallback(this.getDefaultExtServerOptions('/merchants/merchant/validateMerchantHash', 'POST', headers),
                {
                    "merchantCode": merchantCode,
                    "payload": payload,
                    "hashString": hash
                }, cb);
        } catch (error) {
            cb();
        }

    },

    savePayment: function (req, res) {
        var me = this;
        if(req.body.status) {
            if(req.body.status.toLowerCase() == 'success') {
                this.savePaymentSuccess(req, function(data) {
                    res.setHeader("X-Frame-Options", "ALLOW");
                    res.json({ success: true });
                })
            }
            else {
                this.savePaymentFailure(req, function(data) {
                    res.setHeader("X-Frame-Options", "ALLOW");
                    res.json({ success: true });
                })
            }
        }
        else {
            res.setHeader("X-Frame-Options", "ALLOW");
            res.json({ success: false });            
        }
    },

    savePaymentSuccess: function (req, cb) {
        try {
            var pc = pCache.get(req.body.txnid);
            if (!pc || !pc.merchantCode || req.body.mode === 'UPI') {
	res.setHeader("X-Frame-Options", "ALLOW");
                cb();
            }
            else {
                var headers = {
                    'X-AUTHORIZATION': config.defaultToken,
                    'Content-Type': 'application/json'
                };

                pc.amount = req.body.amount;
                pc.cardNumber = req.body.cardnum;
                pc.paymentType = req.body.mode;
                pCache.set(req.body.txnid, pc);
                var status = req.body.status;
                var statusMsg = 'Failed';
                if (status && status.toLowerCase() == 'success')
                    statusMsg = 'Successful';

                var pmtype = 'DEBIT_CARD';
                if (req.body.mode === 'CC')
                    pmtype = 'CREDIT_CARD';
                else if (req.body.mode === 'NB')
                    pmtype = 'NET_BANKING';

                this.postAndCallback(this.getDefaultExtServerOptions('/payments/paymentadapter/payWebRequest', 'POST', headers),
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
                                    "merchantCode": pc.merchantCode,
                                    "merchantName": pc.merchantName,
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
        }
        catch (err) {
            cb();
        }
    },

    getPaymentPageHTML: function (sourceId, id, txnid, merchantId, code, type, mccCode, mVPA, til, name, lastName, number, mobileNo, email, invNumber, amount, minpanamnt, modes,
        mode, vpa, expiryDate, title, description, askname, askemail, askmob, askadd, panaccepted, askresidence, readonlyname, readonlyemail, readonlymob,
        readonlyaddr, mndname, mndemail, mndmob, mndaddress, mndpan, udf1, udf2, udf3, udf4, udf5, successURL, failureURL, url, img, res) {
	res.setHeader("X-Frame-Options", "ALLOW");
        if (this.dt1Greater('01-01-2017', expiryDate))
            expiryDate = null;

        if (expiryDate && this.dt1Greater(this.getCurDateString(), expiryDate)) {
            res.sendFile(urls.expiredLink, { root: __dirname + '/../../' });
        }
        else {
            /*        if(description && description.length > 65)
                        description = description.substring(0, 65);
        
                    if(title && title.length > 35)
                        title = title.substring(0, 35);*/
            if (!img)
                img = config.me + '/paym.png';
           
            var paymentPageData = {                
                "language": 0,
                "amount": amount ? parseFloat(amount) : amount,
                "minpanamnt": minpanamnt ? parseFloat(minpanamnt) : minpanamnt,
                "modes": modes,//typeof modes === 'string' ? [modes] : modes,
                "mode": mode,
                "id": id,
                "sourceId": sourceId ? parseInt(sourceId) : sourceId,
                "txnid": txnid,
                "merchantId": merchantId,
                "email": email,
                "merchantCode": code,
                "mtype": type ? parseInt(type) : type,
                "merchantVpa": mVPA,
                "mccCode": mccCode,
                "vpa": vpa,
                "til": til,
                "firstName": name ? name.replace(/'/g, "|||") : name,
                "lastName": lastName,
                "askname": typeof askname === 'string' ? askname == 'true' : askname,
                "askemail": typeof askemail === 'string' ? askemail == 'true' : askemail,
                "askmob": typeof askmob === 'string' ? askmob == 'true' : askmob,
                "askadd": typeof askadd === 'string' ? askadd == 'true' : askadd,
                "askpan": typeof panaccepted === 'string' ? panaccepted == 'true' : panaccepted,
                "askresidence": typeof askresidence === 'string' ? askresidence == 'true' : askresidence,
                "readonlyname": typeof readonlyname === 'string' ? readonlyname == 'true' : readonlyname,
                "readonlyemail": typeof readonlyemail === 'string' ? readonlyemail == 'true' : readonlyemail,
                "readonlymob": typeof readonlymob === 'string' ? readonlymob == 'true' : readonlymob,
                "readonlyaddr": typeof readonlyaddr === 'string' ? readonlyaddr == 'true' : readonlyaddr,
                "mndname": typeof mndname === 'string' ? mndname == 'true' : mndname,
                "mndemail": typeof mndemail === 'string' ? mndemail == 'true' : mndemail,
                "mndmob": typeof mndmob === 'string' ? mndmob == 'true' : mndmob,
                "mndaddress": typeof mndaddress === 'string' ? mndaddress == 'true' : mndaddress,
                "mndpan": typeof mndpan === 'string' ? mndpan == 'true' : mndpan,
                "phone": number,
                "mobileNo": mobileNo,
                "imageURL": img ? img.replace(/'/g, "|||") : img,
                "title": title ? title.replace(/'/g, "|||") : title,
                "description": description ? description.replace(/'/g, "|||") : description,
                "invoiceNumber": invNumber ? invNumber.replace(/'/g, "|||") : invNumber,
                "expiryDate": expiryDate,//SHOULD WE GIVE FORMAT IN DOCUMENTATION?
                "url": null,
                "successURL": successURL,
                "failureURL": failureURL,
                "udf1": udf1,
                "udf2": udf2,
                "udf3": udf3,
                "udf4": udf4,
                "udf5": udf5
            }
            var nImg = img ? img.replace(/ /g, '') : '';
            var fbPixel = '';
           
            if(url && url.substring(url.lastIndexOf('/') + 1) == 'PCdbR00000000002')
                fbPixel = '<!-- Facebook Pixel Code --> ' +
                    '<script> ' +
                    '!function(f,b,e,v,n,t,s) ' +
                    '{if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)}; ' +
                    "if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0'; " +
                    'n.queue=[];t=b.createElement(e);t.async=!0; ' +
                    't.src=v;s=b.getElementsByTagName(e)[0]; ' + 
                    "s.parentNode.insertBefore(t,s)}(window,document,'script', " +
                    "'https://connect.facebook.net/en_US/fbevents.js'); " +
                    " fbq('init', '413984532337343'); " +
                    "fbq('track', 'PageView'); " +
                    "fbq('track', 'ViewContent'); " +
                    '</script> ' +
                    '<noscript> ' +
                    ' <img height="1" width="1" ' +
                    'src="https://www.facebook.com/tr?id=413984532337343&ev=PageView&noscript=1"/> ' +
                    '</noscript> ' +
                    '<!-- End Facebook Pixel Code -->';

            res.send('<!doctype html>' +
                '<html>' +
                '    <head>' +
                '        <meta charset="utf-8">' +
                '        <meta name="viewport" content="width=device-width, initial-scale=1">' +
                '        <title>benow - payment link</title>' +
                '        <meta property="og:title" content="' + title + '" />' +
                '        <meta property="og:description" content="' + description + '" />' +
                '        <meta property="og:url" content="' + url + '" />' +
                '        <meta property="og:image" content="' + nImg + '" />' +
                '        <meta property="og:image:secure_url" content="' + nImg + '" />' +
                '        <base href="/">' +
                '        <link rel="icon" type="image/x-icon" href="./favicon.png">' +
                '        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">' +
                '        <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">' +
                '        <link href="https://fonts.googleapis.com/css?family=Fjalla+One" rel="stylesheet">' +
                '        <link rel="stylesheet" href="./libs.min.css" />' +
                '        <style>' +
                '            pay, paymentsuccess, paymentfailure, waitingforpayment {' +
                '                display: flex;' +
                '                min-height: 104vh;' +
                '                flex-direction: column;' +
                '            }' +
                '            main {' +
                '                flex: 1 0 auto;' +
                '            }' +
                '        </style>' +
                fbPixel +
                '    </head>' +
                '    <body>' +
                '        <benow></benow>' +
                "        <input type='hidden' id='paymentPageData' value='" + JSON.stringify(paymentPageData) + "' />" +
                '        <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en"></script>' +
                '        <script type="text/javascript" src="/app.js"></script>' +
                '    </body>' +
                '</html>');
        }
    }
}

module.exports = benowCont;