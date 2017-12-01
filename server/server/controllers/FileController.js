var fs = require('fs');
var request = require('request');
var sizeOf = require('image-size');
var fileType = require('file-type');
var readChunk = require('read-chunk');

var helper = require('./../utils/Helper');
var config = require('./../configs/Config');

var fileCont = {    
    deleteUploadedFile(fName, errMsg) {
        if (fs.existsSync(fName))
            fs.unlink(fName);

        res.send({ success: false, errorMsg: errMsg });
    },

    invalidFileSizeTypeDim(req, res, cb) {
        var fp = __dirname + '/../../uploads/' + req.file.filename;
        var tp = fileType(readChunk.sync(fp, 0, 4100));
        if(!tp || !tp.ext || !(tp.ext.toLowerCase() == 'pdf' || tp.ext.toLowerCase() == 'png' || tp.ext.toLowerCase() == 'jpg' || 
            tp.ext.toLowerCase() == 'jpeg')) 
            this.deleteUploadedFile(fp, 'Unsupported file format!');

        var stats = fs.statSync(fp);
        if(!stats || !stats.size || stats.size > 50000000) 
            this.deleteUploadedFile(fp, 'File is bigger than 1 MB!');//5 MB
        else
            cb();
    },

    upload: function (req, res) {
        if (req.fileValidationError)
            res.send({ success: false, errorMsg: req.fileValidationError });
        else {
            var me = this;
            this.invalidFileSizeTypeDim(req, res, function () {
                if (!req.body.headers || !req.body.headers)
                    res.send({ success: false, errorMsg: 'Improper request. Please try again.' });
                else if (!req.file || !req.file.filename)
                    res.send({ success: false, errorMsg: 'Unsupported file format or size!' });
                else {
                    /* var h = JSON.parse(req.body.headers);
                    if (!h['X-AUTHORIZATION'])
                        res.send({ success: false, errorMsg: 'Unauthorized!' });
                    else { */
                        var d = JSON.parse(req.body.data);
                        if (!d.sourceId || !d.sourceType)
                            res.send({ success: false, errorMsg: 'Incorrect input!' });
                        else {
                            var f = req.file.filename;
                            var reqPost = request.post(helper.getDefaultExtFileServerOptions(config.beNowSvc.https + config.beNowSvc.host
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
                            var dcode = req.file.originalname;
                            if(dcode && dcode.length > 50)
                                dcode = dcode.substring(0, 50);
                            
                            form.append('documentVO', JSON.stringify({
                                "sourceId": d.sourceId, "documentName": fName, "sourceType": d.sourceType,
                                "documentCode": dcode
                            }));
                            form.append('file', fs.createReadStream(__dirname + '/../../uploads/' + req.file.filename));
                        }
                    //}
                }
            });
        }
    }
}

module.exports = fileCont;