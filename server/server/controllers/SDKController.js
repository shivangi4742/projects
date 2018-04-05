var fs = require('fs');
var crypto = require('crypto');
var request = require('request');
var pdf = require('html-pdf');
const NodeCache = require("node-cache");
const phantomPath = require('witch')('phantomjs-prebuilt', 'phantomjs');

var helper = require('./../utils/Helper');
var config = require('./../configs/Config');

var sdkCont = {
    paymentFailure: function (req, cb) {
        try {
            var headers = {
                'X-AUTHORIZATION': config.defaultToken,
                'Content-Type': 'application/json'
            };
            var status = req.body.status;
            var statusMsg = 'Failed';

            var pmtype = 'DEBIT_CARD';
            if (req.body.mode === 'CC')
                pmtype = 'CREDIT_CARD';
            else if (req.body.mode === 'NB')
                pmtype = 'NET_BANKING';
            else if (req.body.mode === 'CASH')
                pmtype = 'CASH';
            else if (req.body.mode == 'RAZORPAY')
                pmtype = 'RAZORPAY'

            helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/payWebRequest', 'POST', headers),
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
                                "merchantCode": req.body.udf4,
                                "merchantName": req.body.udf3,
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
        catch (err) {
            cb();
        }
    },

    sendEmail: function(dto, dtext, dsubject, dcc, dbcc, hdrs, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (dto && dtext && dsubject)
                helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/sendEmailNotification', 'POST', hdrs),
                    {
                        "to": dto,
                        "text": dtext,
                        "subject": dsubject,
                        "cc": dcc,
                        "bcc": dbcc
                    }, cb);
            else
                cb(retErr);
        }
        catch (err) {
            cb(retErr);
        }
    },
    
    getSellerMailBody(amount, transactionId, customerName, customerPhone, customerEmail, customerAddress) {
        return '<html> ' +
            '<head> ' +
            '  <style> ' +
            '  table { ' +
            '      font-family: \'Open Sans\', sans-serif; ' +
            '      font-size: 1.75vw; ' +
            '      border-collapse: collapse; ' +
            '      width: 100%; ' +
            '  } ' +
            '  td, th { ' +
            '      border-bottom: 1px solid #dddddd; ' +
            '      text-align: left; ' +
            '      padding: 12px; ' +
            '  } ' +
            '  .mainContent{ ' +
            '    margin-left: 15%; ' +
            '    margin-right: 15%; ' +
            '    padding: 10px; ' +
            '    font-family: \'Open Sans\', sans-serif; ' +
            '    font-size: 1.5vw; ' +
            '  } ' +
            '  .logoImage{ ' +
            '    text-align: center; ' +
            '    margin-bottom: 10px; ' +
            '  } ' +
            '  .title{ ' +
            '    text-align: center; ' +
            '    padding: 12px; ' +
            '    font-size: 1.8vw; ' +
            '  } ' +
            '  .heading{ ' +
            '    font-size: 1.5vw; ' +
            '    font-weight: bold; ' +
            '    margin-bottom: 5px; ' +
            '  } ' +
            '  .table{ ' +
            '    margin-bottom: 20px; ' +
            '  } ' +
            '  .columnnames{ ' +
            '    background-color: #f5f4f4; ' +
            '    color: #e53935; ' +
            '    width: 40%; ' +
            '  } ' +
            '  .data{ ' +
            ' ' +
            '  } ' +
            '  .helpdesk{ ' +
            '    margin-bottom: 30px; ' +
            '  } ' +
            '  a{ ' +
            '    color: royalblue; ' +
            '    text-decoration:  none; ' +
            '  } ' +
            '  a:hover{ ' +
            '    cursor: pointer; ' +
            '  } ' +
            '  .footer{ ' +
            '    border-color: #cccccc; ' +
            '    text-align: center; ' +
            '  } ' +
            ' ' +
            '  </style> ' +
            '</head> ' +
            '<body> ' +
            '  <div class="mainContent"> ' +
            '    <div class="logoImage"> ' +
            '      <img src="http://www.benow.in/wp-content/uploads/2017/11/logo@2x.png" width="108px" height="77"> ' +
            '    </div> ' +
            '    <div class="title"> ' +
            '      Payment Received.<br> ' +
            '      ₹' + amount + ' successfully received. ' +
            '    </div> ' +
            '    <div class="heading"> ' +
            '      Payment Details ' +
            '    </div> ' +
            '    <div class="table"> ' +
            '      <table> ' +
            '        <tr> ' +
            '          <td class="columnnames">Amount</td> ' +
            '          <td>₹' + amount + '</td> ' +
            '        </tr> ' +
            '        <tr> ' +
            '          <td class="columnnames">Payment ID</td> ' +
            '          <td>' + transactionId + '</td> ' +
            '        </tr> ' +
            '        <tr> ' +
            '          <td class="columnnames">Name</td> ' +
            '          <td>' + customerName + '</td> ' +
            '        </tr> ' +
            '        <tr> ' +
            '          <td class="columnnames">Mobile Number</td> ' +
            '          <td>' + customerPhone + '</td> ' +
            '        </tr> ' +
            '        <tr> ' +
            '          <td class="columnnames">Email</td> ' +
            '          <td class="data">' + customerEmail + '</td> ' +
            '        </tr> ' +
            '        <tr> ' +
            '          <td class="columnnames">Address</td> ' +
            '          <td class="data">' + customerAddress + '</td> ' +
            '        </tr> ' +
            '      </table> ' +
            '    </div> ' +
            '    <div class="helpdesk"> ' +
            '      <a href="mailto:helpdesk@benow.in" target="_top">Raise an issue</a>, if there is a problem with this ' +
            '    </div> ' +
            '    <div class="footer"> ' +
            '      © 2018 Benow. All Rights Reserved.<br><br> ' +
            'Hiranandani Lighthall, Tower A, 507 Above Maruti Suzuki Showroom Saki Vihar Road, Andheri East Mumbai 400072 ' +
            '    </div> ' +
            '  </div> ' +
            '</body> ' +
            '</html> ';
    },

    getBuyerMailBody(amount, merchant, merchantMobileNumber, merchantUserId, transactionId) {
        return '<html> ' +
            '<head> ' +
            '  <style> ' +
            '  table { ' +
            '      font-family: \'Open Sans\', sans-serif; ' +
            '      font-size: 1.75vw; ' +
            '      border-collapse: collapse; ' +
            '      width: 100%; ' +
            '  } ' +
            '  td, th { ' +
            '      border-bottom: 1px solid #dddddd; ' +
            '      text-align: left; ' +
            '      padding: 12px; ' +
            '  } ' +
            '  .mainContent{ ' +
            '    margin-left: 15%; ' +
            '    margin-right: 15%; ' +
            '    padding: 10px; ' +
            '    font-family: \'Open Sans\', sans-serif; ' +
            '    font-size: 1.5vw; ' +
            '  } ' +
            '  .logoImage{ ' +
            '    text-align: center; ' +
            '    margin-bottom: 10px; ' +
            '  } ' +
            '  .title{ ' +
            '    text-align: center; ' +
            '    padding: 12px; ' +
            '    font-size: 1.8vw; ' +
            '  } ' +
            '  .heading{ ' +
            '    font-size: 1.5vw; ' +
            '    font-weight: bold; ' +
            '    margin-bottom: 5px; ' +
            '  } ' +
            '  .table{ ' +
            '    margin-bottom: 20px; ' +
            '  } ' +
            '  .columnnames{ ' +
            '    background-color: #f5f4f4; ' +
            '    color: #e53935; ' +
            '    width: 40%; ' +
            '  } ' +
            '  .data{ ' +
            ' ' +
            '  } ' +
            '  .helpdesk{ ' +
            '    margin-bottom: 30px; ' +
            '  } ' +
            '  a{ ' +
            '    color: royalblue; ' +
            '    text-decoration:  none; ' +
            '  } ' +
            '  a:hover{ ' +
            '    cursor: pointer; ' +
            '  } ' +
            '  .footer{ ' +
            '    border-color: #cccccc; ' +
            '    text-align: center; ' +
            '  } ' +
            ' ' +
            '  </style> ' +
            '</head> ' +
            '<body> ' +
            '  <div class="mainContent"> ' +
            '    <div class="logoImage"> ' +
            '      <img src="http://www.benow.in/wp-content/uploads/2017/11/logo@2x.png"  width="108px" height="77"> ' +
            '    </div> ' +
            '    <div class="title"> ' +
            '      Your payment is successful.<br> ' +
            '<img src="http://trak.in/wp-content/uploads/2011/07/image5.png" width="13px" height="15px"/>' + amount + ' successfully paid. ' +
            '    </div> ' +
            '    <div class="heading"> ' +
            '      Payment Details ' +
            '    </div> ' +
            '    <div class="table"> ' +
            '      <table> ' +
            '        <tr> ' +
            '          <td class="columnnames">Merchant Name</td> ' +
            '          <td>' + merchant + '</td> ' +
            '        </tr> ' +
            '        <tr> ' +
            '          <td class="columnnames">Merchant Number</td> ' +
            '          <td>' + merchantMobileNumber + '</td> ' +
            '        </tr> ' +
            '        <tr> ' +
            '          <td class="columnnames">Merchant Email</td> ' +
            '          <td>' + merchantUserId + '</td> ' +
            '        </tr> ' +
            '        <tr> ' +
            '          <td class="columnnames">Payment ID</td> ' +
            '          <td>' + transactionId + '</td> ' +
            '        </tr> ' +
            '        <tr> ' +
            '          <td class="columnnames">Amount</td> ' +
            '          <td class="data"><img src="http://trak.in/wp-content/uploads/2011/07/image5.png" width="10px" height="12px"/>' + amount + 
            '</td> ' +
            '        </tr> ' +
            '      </table> ' +
            '    </div> ' +
            '    <div class="helpdesk"> ' +
            '      <a href="mailto:helpdesk@benow.in" target="_top">Raise an issue</a>, if there is a problem with this ' +
            '    </div> ' +
            '    <div class="footer"> ' +
            '      © 2018 Benow. All Rights Reserved.<br><br> ' +
            'Hiranandani Lighthall, Tower A, 507 Above Maruti Suzuki Showroom Saki Vihar Road, Andheri East Mumbai 400072 ' +
            '    </div> ' +
            '  </div> ' +
            '</body> ' +
            '</html> ';
    },
    
    saveCashPaymentSuccess: function (req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        this.paymentSuccess(req, function (data) {
            res.json(data);
        });
    },

    get80G: function (req, res) {
        res.setHeader("Content-Type", "application/pdf");
        if (fs.existsSync(__dirname + '/80g/' + req.params.txnid + '.pdf'))
            res.sendFile(__dirname + '/80g/' + req.params.txnid + '.pdf');
        else {
            req.body.dontemailPDF = true;
            this.send80G(req, function (data) {
                if (fs.existsSync(__dirname + '/80g/' + req.params.txnid + '.pdf'))
                    res.sendFile(__dirname + '/80g/' + req.params.txnid + '.pdf');
            });
        }
    },

    send80GCertificate: function (req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        this.send80G(req, function (data) {
            res.json(data);
        });
    },

    sendSuccessEmails: function(req) {
        try {
            var me = this;
            if(req && req.body && req.body.txnid && req.params && req.params.code) {
                helper.postAndCallback(helper.getDefaultedExtServerOptions('/merchants/merchant/fetchMerchantDetails', 'POST',
                    req.headers),
                    {
                        "merchantCode": req.params.code
                    },
                    function (mData) {
                        if(mData && mData.userId) {
                            helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/getPayerDetailByTransactionRefNumber',
                            'POST', req.headers),
                            {
                                "txnRefNumber": req.body.txnid
                            }, 
                            function(cData2) {
                                if(cData2 && cData2.length > 0) {
                                    var cData = cData2[0];
                                    if(cData && cData.txnRefNumber) {
                                        me.sendEmail(mData.userId, me.getSellerMailBody(req.body.amount, req.body.txnid, cData.name, cData.mobileNo, 
                                            cData.email, cData.address), 'Ordered Successfully', null, null, req.headers, function(m1) {
                                            });
                                        if(cData.email)
                                            me.sendEmail(cData.email, me.getBuyerMailBody(req.body.amount, mData.displayName, mData.mobileNumber,
                                                mData.userId, req.body.txnid), 'Order Received on Benow', null, null, req.headers, function(m2) {
                                                })    
                                    }    
                                }
                            });
                        }
                    });
            }
        }
        catch(exc) {

        }
    },

    send80G: function (req, cb) {
        try {
            if (req && req.params && req.params.id) {
                var me = this;
                req.body.campaignId = req.params.id;
                this.getPaymentLinkDetailsPost(req, function (cData) {
                    if (cData && cData.merchantCode) {
                        helper.postAndCallback(helper.getDefaultedExtServerOptions('/merchants/merchant/fetchMerchantDetails', 'POST',
                            req.headers),
                            {
                                "merchantCode": cData.merchantCode
                            },
                            function (mData) {
                                if (mData && mData.userId && mData.auto80gEnabled) {
                                    helper.postAndCallback(helper.getDefaultedExtServerOptions('/merchants/merchant/fetchMerchantForEditDetails',
                                        'POST', req.headers),
                                        {
                                            "userId": mData.userId,
                                            "sourceId": mData.id.toString(),
                                            "sourceType": "MERCHANT_REG"
                                        }, function (m2Data) {
                                            helper.postAndCallback(helper.getDefaultedExtServerOptions('/payments/paymentadapter/getDataByPaymentLinkByCriteria',
                                                'POST', req.headers),
                                                {
                                                    "txnRefNumber": req.params.txnid
                                                }, function (dData) {
                                                    if (dData && dData.length > 0 && dData[0].name) {
                                                        var amnt = (Math.round(dData[0].paidAmount * 100) / 100).toString();

                                                        if (amnt.indexOf('.') < 0)
                                                            amnt = amnt + '.00';

                                                        if (amnt.indexOf('.') > amnt.length - 1)
                                                            amnt = amnt + '00';

                                                        if (amnt.indexOf('.') > amnt.length - 2)
                                                            amnt = amnt + '0';

                                                        var dt = dData[0].transactionDate;
                                                        if (dt && dt.length > 10)
                                                            dt = dt.substring(0, 10).replace(/-/g, '/');

                                                        //auto80GEnabled - PUT A CHECK HERE
                                                        var options = { format: 'A4' };
                                                        var html = fs.readFileSync('./80g.html', 'utf8')
                                                            .replace(/{{RECEIVEDAMOUNT}}/g, amnt)
                                                            .replace(/{{NGONAME}}/g, m2Data.businessName ? m2Data.businessName : '')
                                                            .replace('{{RECEIPTDATE}}', dt ? dt : '')
                                                            .replace('{{NGOEMAIL}}', m2Data.userId ? m2Data.userId : '')
                                                            .replace('{{NGOPAN}}', m2Data.panNumber ? m2Data.panNumber : '')
                                                            .replace('{{NGOADDRESS}}', m2Data.address ? m2Data.address : '')
                                                            .replace('{{RECEIVEDFROM}}', dData[0].name ? dData[0].name : '')
                                                            .replace('{{RECEIPTNUM}}', req.params.txnid ? req.params.txnid : '')
                                                            .replace('{{NGOPHONE}}', m2Data.mobileNumber ? m2Data.mobileNumber : '')
                                                            .replace('{{RECEIVEDFROMADDRESS}}', dData[0].address ? dData[0].address : '')
                                                            .replace('{{CERTIFICATENUMBER}}', m2Data.ngoCertifnum ? m2Data.ngoCertifnum : '')
                                                            .replace('{{CERTIFICATEISSUEDON}}', m2Data.ngoCertifdate ? m2Data.ngoCertifdate : '')
                                                            .replace('{{CERTPAYPNGURL}}', config.me + '/certificatepay.png')
                                                            .replace('{{RECEIVEDAMOUNTDETAILED}}', amnt + ' (' + helper.inWords(amnt) + ')');
                                                        var logo = mData.merchantLogoUrl;
                                                        if (m2Data && m2Data.documentResponseVO && m2Data.documentResponseVO.documentList &&
                                                            m2Data.documentResponseVO.documentList.length > 0) {
                                                            for (var i = 0; i < m2Data.documentResponseVO.documentList.length; i++) {
                                                                if (m2Data.documentResponseVO.documentList[i].documentCode &&
                                                                    m2Data.documentResponseVO.documentList[i].documentCode.toUpperCase() == 'LOGO') {
                                                                    logo = m2Data.documentResponseVO.documentList[i].documentUrl;
                                                                    if (logo && logo[0] != '/')
                                                                        logo = '/' + logo;

                                                                    break;
                                                                }
                                                            }
                                                        }

                                                        if (logo)
                                                            html = html.replace('{{LOGOURL}}',
                                                                '<IMG style="max-height: 100px; max-width: 370px;" src="https://mobilepayments.benow.in/merchants' +
                                                                logo + '" alt="" />');
                                                        else
                                                            html = html.replace('{{LOGOURL}}', '');

                                                        fs.writeFileSync(__dirname + '/../../dist/80g/' + req.params.txnid + '.html', html);
                                                        var pdfstream = fs.createWriteStream(__dirname + '/80g/' + req.params.txnid + '.pdf');
                                                        pdfstream.on('close', function () {
                                                            if (fs.existsSync(__dirname + '/../../dist/80g/' + req.params.txnid + '.html'))
                                                                fs.unlink(__dirname + '/../../dist/80g/' + req.params.txnid + '.html');

                                                            if (!req.body.dontemailPDF && dData[0].email) {
                                                                var reqPost = request.post(helper.getDefaultExtFileServerOptions(config.beNowSvc.https +
                                                                    config.beNowSvc.host + ':' + config.beNowSvc.port + '/merchants/merchant/sendEmailNotify', 'POST',
                                                                    req.headers),
                                                                    function (err, resp, body) {
                                                                        cb();
                                                                    });

                                                                var form = reqPost.form();
                                                                form.append('sendEmailVO', JSON.stringify({
                                                                    "to": dData[0].email, "subject": "Thank you for your donation!", "text": "Thank you for your donation!", "text": "Dear '"+ dData[0].name +"',<br> Thank you for your generous donation of '" + amnt + "' towards '" + m2Data.businessName + "' .  Your donation reference number is '"+ req.params.txnid +"' <br>  Please find attached the tax-benefit receipt under Section 80G of the Income Tax Act for your donation. <br> We thank you from the bottom of our heart for your contribution. Your support helps us to continue our mission and makes it possible for our organisation to exist and provide the community a warm place to live in. <br> Thank you again!"
                                                                }));
                                                                form.append('file', fs.createReadStream(__dirname + '/80g/' + req.params.txnid + '.pdf'));
                                                            }
                                                            else
                                                                cb();
                                                        });
                                                        request('http://www.html2pdf.it/?url=https%3A%2F%2F' + config.me.replace('https://', '').replace('http://', '') + '%2F80g%2F' + req.params.txnid + '.html&download=false&format=A4&orientation=portrait&margin=1cm')
                                                            .pipe(pdfstream);
                                                        //THIS IS WHEN PHANTOM WAKES UP
                                                        /*                                         pdf.create(html, options).toFile('./80g/' + req.params.txnid + '.pdf', function(err, res) {
                                                                                                    request('http://www.html2pdf.it/?url=https%3A%2F%2F' + config.me.replace('https://', '').replace('http://', '') + '%2F80g%2F' + req.params.txnid + '.html&download=false&format=A4&orientation=portrait&margin=1cm')
                                                                                                        .pipe(fs.createWriteStream(__dirname + '/../../80g/' + req.params.txnid + '.pdf'))
                                                                                                    var reqPost = request.post(helper.getDefaultExtFileServerOptions(config.beNowSvc.https + 
                                                                                                        config.beNowSvc.host + ':' + config.beNowSvc.port + '/merchants/merchant/sendEmailNotify', 'POST', 
                                                                                                        req.headers),
                                                                                                        function (err, resp, body) {
                                                                                                            cb();
                                                                                                        });                    
                                                    
                                                                                                    var form = reqPost.form();
                                                                                                    form.append('sendEmailVO', JSON.stringify({
                                                                                                        "to": "yatishg@gmail.com", "subject": "80G Certificate", "text": "Please find your 80G Certificate attached with this mail."
                                                                                                    }));
                                                                                                    form.append('file', fs.createReadStream(__dirname + '/../../80g/' + req.params.txnid + '2.pdf'));
                                                                                                });                                                     */
                                                    }
                                                });
                                        });
                                }
                            });
                    }
                })
            }
        }
        catch (err) {
            cb();
        }
    },

    paymentSuccess: function (req, cb) {
        try {
            var headers = {
                'X-AUTHORIZATION': config.defaultToken,
                'Content-Type': 'application/json'
            };
            var fundraiserid = req.params.fund;
            if (fundraiserid)
                this.updateFundraiserCollectionPostCall(req.params.fund, req.params.id, req.params.txnid, req.body.amount, headers,
                    function (fundata) { });

            var status = req.body.status;
            var statusMsg = 'Failed';
            if (status && status.toLowerCase() == 'success')
                statusMsg = 'Successful';

            var pmtype = 'DEBIT_CARD';
            if (req.body.mode === 'CC')
                pmtype = 'CREDIT_CARD';
            else if (req.body.mode === 'NB')
                pmtype = 'NET_BANKING';
            else if (req.body.mode == 'CASH')
                pmtype = 'CASH'
            else if (req.body.mode == 'RAZORPAY')
                pmtype = 'RAZORPAY'

            var me = this;
            helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/payWebRequest', 'POST', headers),
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
                                "merchantCode": req.body.udf4,
                                "merchantName": req.body.udf3,
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
                function (dd) {
                    me.sendSuccessEmails(req);
                    if (req.body.send80GAutomatically)
                        me.send80G(req, function () {
                        });

                    cb(dd);
                });
        }
        catch (err) {
            cb();
        }
    },

    paytmSuccess: function (req, data, cb) {
        try {
            var headers = {
                'X-AUTHORIZATION': config.defaultToken,
                'Content-Type': 'application/json'
            };

            var status = '';

            if (data.status == 'TXN_SUCCESS') {
                status = 'success';
            }
            else {
                status = 'Failed';
            }

            var statusMsg = 'Failed';
            if (status && status.toLowerCase() == 'success')
                statusMsg = 'Successful';

            var pmtype = data.paymentMethod;

            var me = this;
            helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/payWebRequest', 'POST', headers),
                {
                    "amount": data.amount,
                    "hdrTransRefNumber": data.orderId,
                    "listPayments": [
                        {
                            "paymentDetails": {
                                "deviceDetails": {
                                    "applicationName": "com.benow",
                                    "deviceId": "browser",
                                    "mobileNumber": data.phone
                                },
                                "merchantCode": req.body.udf4,
                                "merchantName": req.body.udf3,
                                "payeeVirtualAddress": "",
                                "payerUsername": req.body.phone,
                                "paymentInvoice": {
                                    "amountPayable": data.amount
                                },
                                "remarks": "",
                                "thirdPartyTransactionResponseVO": {
                                    "referanceNumber": data.orderId,
                                    "response": JSON.stringify(data)
                                },
                                "txnId": data.orderId
                            },
                            "paymentMethodType": pmtype,
                            "paymentTransactionStatus": {
                                "transactionStatus": statusMsg
                            }
                        }
                    ]
                },
                function (dd) {
                    if (req.body.send80GAutomatically)
                        me.send80G(req, function () {
                        });

                    cb();
                });
        }
        catch (err) {
            cb();
        }
    },

    paytmFailure: function (req, data, cb) {
        try {
            var headers = {
                'X-AUTHORIZATION': config.defaultToken,
                'Content-Type': 'application/json'
            };
            var status = data.status;
            var statusMsg = 'Failed';
            if (status && status.toLowerCase() == 'success')
                statusMsg = 'Successful';

            var pmtype = 'DEBIT_CARD';
            if (data.mode === 'CC')
                pmtype = 'CREDIT_CARD';
            else if (data.mode === 'NB')
                pmtype = 'NET_BANKING';
            else if (data.mode === 'CASH')
                pmtype = 'CASH';
            else if (data.mode == 'RAZORPAY')
                pmtype = 'RAZORPAY'

            helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/payWebRequest', 'POST', headers),
                {
                    "amount": data.amount,
                    "hdrTransRefNumber": data.txnid,
                    "listPayments": [
                        {
                            "paymentDetails": {
                                "deviceDetails": {
                                    "applicationName": "com.benow",
                                    "deviceId": "browser",
                                    "mobileNumber": data.phone
                                },
                                "merchantCode": data.udf4,
                                "merchantName": data.udf3,
                                "payeeVirtualAddress": "",
                                "payerUsername": data.phone,
                                "paymentInvoice": {
                                    "amountPayable": data.amount
                                },
                                "remarks": "",
                                "thirdPartyTransactionResponseVO": {
                                    "referanceNumber": data.txnid,
                                    "response": JSON.stringify(data)
                                },
                                "txnId": data.txnid
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
        catch (err) {
            cb();
        }
    },

    processPayment: function (req, res) {
        res.setHeader("X-Frame-Options", "ALLOW");
        var paylinkid = req.body.paylinkid;
        var txnId = req.body.txnid;
        try {
            var cat = req.body.paytype;
            if (cat == 6) { // RAZORPAY flow
                var prods = req.body.prods;
                if (!prods && prods.length <= 0) {
                    prods = 0;
                }

                if (req.body.hasfundraiser && req.body.hasfundraiser.toString().toLowerCase() == "true") {
                    res.redirect(config.base + '/ppl/razorpay/' + paylinkid + '/' + prods + '/' + txnId + '/' + parseFloat(req.body.payamount) * 100 + '/' + req.body.fundraiserid);
                }
                else {
                    res.redirect(config.base + '/ppl/razorpay/' + paylinkid + '/' + prods + '/' + txnId + '/' + parseFloat(req.body.payamount) * 100);
                }

            }
            else {
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

                var surl = config.paymentGateway.newsurl + paylinkid + '/' + req.body.txnid;
                var furl = config.paymentGateway.newfurl + paylinkid + '/' + req.body.txnid;
                if (req.body.mtype == 2) {
                    if (req.body.hasfundraiser && req.body.hasfundraiser.toString().toLowerCase() == "true") {
                        surl = config.paymentGateway.dsurl + paylinkid + '/' + req.body.txnid + '/' + req.body.fundraiserid;
                        furl = config.paymentGateway.dfurl + paylinkid + '/' + req.body.txnid + '/' + req.body.fundraiserid;
                    }
                    else {
                        surl = config.paymentGateway.dsurl + paylinkid + '/' + req.body.txnid;
                        furl = config.paymentGateway.dfurl + paylinkid + '/' + req.body.txnid;
                    }
                }

                if (req.body.sourceId == 2) {
                    surl = req.body.surl;
                    furl = req.body.furl;
                }
                else if (req.body.sourceId == 1) {
                    surl = config.paymentGateway.sdksurl + paylinkid + '/' + req.body.txnid;
                    furl = config.paymentGateway.sdkfurl + paylinkid + '/' + req.body.txnid;
                }
                else {
                    if (req.body.surl && req.body.surl.length > 4)
                        surl = req.body.surl;

                    if (req.body.furl && req.body.furl.length > 4)
                        furl = req.body.furl;
                }
                var payload = {
                    "key": config.paymentGateway.key,
                    "curl": config.paymentGateway.curl,
                    "surl": surl,
                    "furl": furl,
                    "udf1": req.body.udf1 ? req.body.udf1 : '',
                    "udf2": req.body.udf2 ? req.body.udf2 : '',
                    "udf3": req.body.merchantname,
                    "udf4": req.body.merchantcode,
                    "udf5": paylinkid ? paylinkid : '',
                    "udf6": req.body.udf6 ? req.body.udf6 : '',
                    "udf7": req.body.udf7 ? req.body.udf7 : '',
                    "udf8": '',
                    "udf9": '',
                    "udf10": '',
                    "ismobileview": req.body.ismobileview,
                    "txnid": req.body.txnid,
                    "drop_category": drop_cat,
                    "phone": req.body.mobileNo,
                    "amount": req.body.payamount,
                    "lastname": req.body.lastname,
                    "firstname": req.body.firstname,
                    "productinfo": req.body.merchantname,
                    "email": req.body.email ? req.body.email : ""
                };

                if (cat == 3)
                    payload.pg = 'NB';

                var obj;

                obj = {
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
                    "udf6": payload.udf6,
                    "udf7": payload.udf7,
                    "udf8": payload.udf8,
                    "udf9": payload.udf9,
                    "udf10": payload.udf10,
                    "phone": payload.phone,
                    "username": payload.phone
                };
                this.hashPayloadPost(paylinkid, obj, headers, payload, helper.getDefaultExtServerOptions, helper.postAndCallback, res, req.body.mtype);
            }
        }
        catch (err) {
            res.redirect(config.paymentGateway.furl + paylinkid + '/' + req.body.txnid);
        }
    },

    hashPayloadPost: function (paylinkid, obj, headers, payload, cb1, cb2, rd, mtype) {
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
                                        if (mtype == 2)
                                            rd.redirect(config.me + '/donationfailure/' + paylinkid);
                                        else
                                            rd.redirect(config.me + '/paymentfailure/' + paylinkid);
                                    }

                                    if (remoteResponse && remoteResponse.caseless && remoteResponse.caseless.dict)
                                        rd.redirect(remoteResponse.caseless.dict.location);
                                    else {
                                        if (mtype == 2)
                                            rd.redirect(config.me + '/donationfailure/' + paylinkid);
                                        else
                                            rd.redirect(config.me + '/paymentfailure/' + paylinkid);
                                    }
                                }
                                catch (error) {
                                    if (mtype == 2)
                                        rd.redirect(config.me + '/donationfailure/' + paylinkid);
                                    else
                                        rd.redirect(config.me + '/paymentfailure/' + paylinkid);
                                }
                            });
                    }
                    else {
                        if (mtype == 2)
                            rd.redirect(config.me + '/donationfailure/' + paylinkid);
                        else
                            rd.redirect(config.me + '/paymentfailure/' + paylinkid);
                    }
                });
        }
        catch (err) {
            if (mtype == 2)
                rd.redirect(config.me + '/donationfailure/' + paylinkid);
            else
                rd.redirect(config.me + '/paymentfailure/' + paylinkid);
        }
    },

    getTransactionStatus: function (req, res) {
        res.setHeader("X-Frame-Options", "ALLOW");
        this.getTransactionStatusPost(req, function (data) {
            res.json(data);
        });
    },

    updateFundraiserCollection: function (req, res) {
        res.setHeader("X-Frame-Options", "ALLOW");
        this.updateFundraiserCollectionPost(req, function (data) {
            res.json(data);
        });
    },

    getFundraiserDetails: function (req, res) {
        res.setHeader("X-Frame-Options", "ALLOW");
        this.getFundraiserDetailsPost(req, function (data) {
            res.json(data);
        });
    },

    createBillString: function (req, res) {
        res.setHeader("X-Frame-Options", "ALLOW");
        this.createBillStringPost(req, function (data) {
            res.json(data);
        });
    },

    createBill: function (req, res) {
        res.setHeader("X-Frame-Options", "ALLOW");
        this.createBillPost(req, function (data) {
            res.json(data);
        });
    },

    updateFundraiserCollectionPostCall(fundraiserId, campaignId, paymentTxnId, amount, hdrs, cb) {
        helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/updateFundraiserForCampaign', 'POST', hdrs),
            {
                "txnRefNumber": campaignId,
                "fundraiserId": fundraiserId,
                "paymentTxnRefNumber": paymentTxnId,
                "actualCollection": amount
            }, cb);
    },

    updateFundraiserCollectionPost: function (req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };
        try {
            if (req && req.body && req.body.amount && req.body.campaignId && req.body.fundraiserId && req.body.txnId)
                this.updateFundraiserCollectionPostCall(req.body.fundraiserId, req.body.campaignId, req.body.txnId, req.body.amount, req.headers, cb);
            else
                cb(retErr);
        }
        catch (err) {
            cb(retErr);
        }
    },

    getFundraiserDetailsPost: function (req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };
        try {
            if (req && req.body && req.body.campaignId && req.body.fundraiserId)
                helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/getFundraiserForCampaign', 'POST', req.headers),
                    {
                        "txnRefNumber": req.body.campaignId,
                        "fundraiserId": req.body.fundraiserId
                    }, cb);
            else
                cb(retErr);
        }
        catch (err) {
            cb(retErr);
        }
    },

    getTransactionStatusPost: function (req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };
        try {
            if (req && req.body && req.body.merchantCode && req.body.txnId)
                helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/ecomm/getMerchantTransactionStatus', 'POST', req.headers),
                    {
                        "merchantCode": req.body.merchantCode,
                        "txnId": req.body.txnId
                    }, cb);
            else
                cb(retErr);
        }
        catch (err) {
            cb(retErr);
        }
    },

    createBillStringPost: function (req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };
        try {
            if (req && req.body && req.body.merchantCode && req.body.amount) {
                var d = req.body;
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

                helper.postAndCallbackString(helper.getDefaultExtServerOptions('/merchants/merchant/getDynamicQRString', 'POST', req.headers),
                    obj, cb);
            }
            else
                cb(retErr);
        }
        catch (err) {
            cb(retErr);
        }
    },

    createBillPost: function (req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };
        try {
            if (req && req.body && req.body.merchantCode && req.body.amount) {
                var d = req.body;
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

                helper.postSaveImgAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/getDynamicQRCode',
                    'POST', req.headers), obj, d.merchantCode, cb);
            }
            else
                cb(retErr);
        }
        catch (err) {
            cb(retErr);
        }
    },

    startPaymentProcess: function (req, res) {
        res.setHeader("X-Frame-Options", "ALLOW");
        this.startPaymentProcessPost(req, function (data) {
            res.json(data);
        });
    },

    savePayerProducts: function (merchantCode, products, counter, txnNumber, hdrs, retErr, cb) {
        try {
            var me = this;
            var retVal = { "transactionRef": txnNumber };
            if (products && products.length > counter) {
                helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/savePayerProduct', 'POST', hdrs),
                    {
                        "merchantCode": merchantCode,
                        "transactionRef": txnNumber,
                        "campaignProductId": products[counter].id,
                        "quantity": products[counter].qty
                    },
                    function (data) {
                        me.savePayerProducts(merchantCode, products, ++counter, txnNumber, hdrs, retErr, cb);
                    });
            }
            else
                cb(retVal);
        }
        catch (err) {
            cb(retErr);
        }
    },

    startPaymentProcessPost: function (req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            var d = req.body;
            var paylinkid = '0';
            var me = this;
            var hdrs = req.headers;
            if (d && d.payamount && d.merchantcode && d.paylinkid) {
                paylinkid = d.paylinkid;
                var name = d.name;
                var address = d.address;
                var email = d.email;
                var mobileNo = d.mobileNo;
                var pan = d.pan;
                var resident = d.resident;
                var employeeId = d.employeeId;
                var companyName = d.companyName;
                var pt = 'UPI_OTHER_APP';
                if (d.paytype === 1)
                    pt = 'CREDIT_CARD';
                else if (d.paytype === 2)
                    pt = 'DEBIT_CARD';
                else if (d.paytype === 3)
                    pt = 'NET_BANKING';
                else if (d.paytype === 6)
                    pt = 'RAZORPAY';
                else if (d.paytype === 5)
                    pt = 'CASH';

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
                if (d.tr)
                    obj.tr = d.tr;

                if (d.til)
                    obj.till = d.til;

                var c = {
                    "xauth": config.defaultToken,
                    "merchantCode": d.merchantcode,
                    "merchantName": d.merchantname,
                    "merchantURL": d.merchantURL
                };
                var products = d.products;
                helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/checkPayer', 'POST', hdrs),
                    {
                        "userId": mobileNo
                    },
                    function (uData) {
                        if (uData && uData.responseFromAPI == true) {
                            helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/initiatePayWebRequest', 'POST', hdrs),
                                obj,
                                function (data) {
                                    if (data && data.hdrTransRefNumber) {
                                        helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/getPpPayer', 'POST', hdrs),
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
                                                "txnDate": me.getCurDateTimeString,
                                                "employeeId": employeeId,
                                                "companyName": companyName
                                            },
                                            function (sdata) {
                                                me.savePayerProducts(d.merchantcode, products, 0, data.hdrTransRefNumber, hdrs, retErr, cb);
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

    createPaymentLink: function (req, res) {
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
                if (d) {
                    var hdrs = req.headers;

                    this.createPaymentLinkPost(d, hdrs, function (data) {
                        res.json(data);
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

    createPaymentLinkPost: function (d, hdrs, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!d)
                cb(retErr);
            else {
                if (d && d.merchantCode) {
                    var expDt = d.expiryDate;
                    if (expDt && expDt.length > 9) {
                        var spExDt = expDt.split('-');
                        if (spExDt && spExDt.length > 2)
                            expDt = spExDt[2] + '-' + spExDt[1] + '-' + spExDt[0] + ' 17:59:59';
                    }

                    var me = this;
                    helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/portablePaymentRequest', 'POST', hdrs),
                        {
                            "merchantCode": d.merchantCode,
                            "amount": d.amount,
                            "description": d.description,
                            "refNumber": d.invoiceNumber,
                            "expiryDate": expDt,
                            "askname": true,
                            "askemail": true,
                            "askmob": true,
                            "mndname": true,
                            "mndemail": true,
                            "mndmob": true
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

    getPaymentLinkDetails: function (req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        this.getPaymentLinkDetailsPost(req, function (data) {
            res.json(data);
        });
    },

    getPaymentLinkDetailsPost: function (req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body)
                cb(retErr);
            else {
                var d = req.body;
                if (d && d.campaignId)
                    helper.getAndCallback(
                        helper.getDefaultExtServerOptions('/payments/paymentadapter/getPortablePaymentRequest?txnRef=' + d.campaignId,
                            'GET', req.headers), cb, false);
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    getCampaignLinkDetails: function (mid, link, hdrs, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!mid || !link)
                cb(retErr);
            else {
                helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/getParameters', 'POST', hdrs),
                    {
                        "paramType": 'alias',
                        "paramCode": mid + '/' + link
                    },
                    cb);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    saveLogs: function (data, hdrs, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!data)
                cb(retErr);
            else {
                helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/logging/saveLog', 'POST', hdrs),
                    {
                        "appName": "websdk",
                        "txnRef": data.txnid,
                        "correlationId": "",
                        "logType": "imp",
                        "val1": "",
                        "val2": "",
                        "val3": "",
                        "description1": "",
                        "description2": "",
                        "description3": "",
                        "logText": JSON.stringify(data),
                        "logFormate": "json"
                    },
                    cb);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    getLogById: function (req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        this.getLogByIdPost(req, function (data) {
            res.json(data);
        });
    },

    getLogByIdPost: function (req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req.body || !req.body.id)
                cb(retErr);
            else {
                helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/logging/getLogById', 'POST', req.headers),
                    {
                        "id": req.body.id
                    },
                    cb);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },
    getmerchantpaymentlink: function (req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        this.getMerchantPaymentlinkPost(req, function (data) {

            res.json(data);
        });
    },

    getMerchantPaymentlinkPost: function (req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req.body || !req.body.merchantCode)
                cb(retErr);
            else {
                helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/getMerchantPaymentLinks', 'POST', req.headers),
                    {
                        "merchantCode": req.body.merchantCode,
                        "pageNumber": req.body.pageNumber
                    },
                    cb);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    razorpayCapturePayment: function (req, res) {
        res.setHeader("X-Frame-Options", "ALLOW");
        this.razorpayCapturePaymentPOST(req, function (data) {
            res.json(data);
        });
    },

    razorpayCapturePaymentPOST: function (req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req.body || !req.body.razorpayId)
                cb(retErr);
            else {
                helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/razorpayCapturePayment', 'POST', req.headers),
                    {
                        "razorpayId": req.body.razorpayId,
                        "txnId": req.body.txnId
                    },
                    cb);
            }
        }
        catch (err) {
            cb(retErr);
        }

    },

    razorpayConfirmPayment: function (req, res) {
        res.setHeader("X-Frame-Options", "ALLOW");
        this.razorpayConfirmPaymentPOST(req, res, function (data) {
            res.json(data);
        });
    },

    razorpayConfirmPaymentPOST: function (req, rd, cb) {

        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req.body || !req.body.amount)
                cb(retErr);
            else {
                paylinkid = req.body.paylinkid;

                var surl = config.paymentGateway.newsurl + paylinkid + '/' + req.body.txnid;
                var furl = config.paymentGateway.newfurl + paylinkid + '/' + req.body.txnid;

                if (req.body.mtype == 2) {
                    if (req.body.hasfundraiser && req.body.hasfundraiser.toString().toLowerCase() == "true") {
                        surl = config.paymentGateway.dsurl + paylinkid + '/' + req.body.txnid + '/' + req.body.fundraiserid;
                        furl = config.paymentGateway.dfurl + paylinkid + '/' + req.body.txnid + '/' + req.body.fundraiserid;
                    }
                    else {
                        surl = config.paymentGateway.dsurl + paylinkid + '/' + req.body.txnid;
                        furl = config.paymentGateway.dfurl + paylinkid + '/' + req.body.txnid;
                    }
                }

                // if (req.body.sourceId == 2) {
                //     surl = req.body.surl;
                //     furl = req.body.furl;
                // }
                // else if (req.body.sourceId == 1) {
                //     surl = config.paymentGateway.sdksurl + paylinkid + '/' + req.body.txnid;
                //     furl = config.paymentGateway.sdkfurl + paylinkid + '/' + req.body.txnid;
                // }
                // else {
                //     if (req.body.surl && req.body.surl.length > 4)
                //         surl = req.body.surl;

                //     if (req.body.furl && req.body.furl.length > 4)
                //         furl = req.body.furl;
                // }

                var url = '';
                if (req.body.status.toLowerCase() == 'success') {
                    url = surl;
                }
                else {
                    url = furl;
                }

                request.post({ url: url, form: req.body },
                    function (err, remoteResponse, remoteBody) {
                        try {
                            if (err) {
                                if (mtype == 2)
                                    rd.redirect(config.me + '/donationfailure/' + paylinkid);
                                else
                                    rd.redirect(config.me + '/paymentfailure/' + paylinkid);
                            }

                            if (remoteResponse) {
                                rd.redirect(url);
                            }
                            else {
                                if (mtype == 2)
                                    rd.redirect(config.me + '/donationfailure/' + paylinkid);
                                else
                                    rd.redirect(config.me + '/paymentfailure/' + paylinkid);
                            }
                        }
                        catch (error) {
                            if (mtype == 2)
                                rd.redirect(config.me + '/donationfailure/' + paylinkid);
                            else
                                rd.redirect(config.me + '/paymentfailure/' + paylinkid);
                        }
                    });
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    getMerchantPaymentInfo: function (req, res) {
        res.setHeader("X-Frame-Options", "ALLOW");
        this.getMerchantPaymentInfoPOST(req, function (data) {
            res.json(data);
        });
    },

    getMerchantPaymentInfoPOST: function (req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req.body || !req.body.merchantCode)
                cb(retErr);
            else {
                helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/getMerchantPaymentInfo', 'POST', req.headers),
                    {
                        "merchantCode": req.body.merchantCode,
                        "paymentMethod": req.body.paymentMethodType
                    },
                    cb);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    getPaytmChecksum: function (req, res) {
        res.setHeader("X-Frame-Options", "ALLOW");
        this.getPaytmChecksumPOST(req, function (data) {
            res.json(data);
        });
    },

    getPaytmChecksumPOST: function (req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };
        try {
            if (!req.body || !req.body.data)
                cb(retErr);
            else {
                helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/getPaytmChecksum', 'POST', req.headers),
                    req.body.data,
                    cb);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    validatePaytmChecksum: function (req, res) {
        res.setHeader("X-Frame-Options", "ALLOW");
        this.validatePaytmChecksumPOST(req, function (data) {
            res.json(data);
        });
    },

    validatePaytmChecksumPOST: function (req, data, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };
        var headers = {
            'X-AUTHORIZATION': config.defaultToken,
            'Content-Type': 'application/json'
        };

        try {
            if (!data)
                cb(retErr);
            else {
                helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/validatePaytmChecksum', 'POST', headers),
                    data,
                    cb);
            }
        }
        catch (err) {
            cb(retErr);
        }
    }
}

module.exports = sdkCont;