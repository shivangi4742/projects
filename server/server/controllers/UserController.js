var helper = require('./../utils/Helper');

var userCont = {
    getTilsGet: function (merchantCode, token, email, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!merchantCode || !token)
                cb(retErr);
            else
                helper.getAndCallback(helper.getIntExtServerOptions('/merchants/merchant/getMerchantTills?merchantCode=' +
                    merchantCode, 'GET', token, email), cb);
        }
        catch (err) {
            cb(retErr);
        }
    },

    signInTilPost: function (req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };
        try {
            if (!req || !req.body) {
                cb(retErr);
            }
            else {
                var d = req.body;
                if (d && d.email && d.password) {
                    helper.postAndCallback(helper.getExtServerOptions('/merchants/merchant/empWebLogin', 'POST', req.headers),
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

    signInPost: function (req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body) {
                cb(retErr);
            }
            else {
                var d = req.body;
                if (d && d.email && d.password) {
                    helper.postAndCallback(helper.getExtServerOptions('/merchants/merchant/bizWebLogin', 'POST', req.headers),
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

    fetchMerchantDetailsPost: function (email, hdrs, cb) {
        var retErr = {
            "success": false,
            "token": null,
            "errorCode": "Something went wrong. Please try again."
        };
        try {
            if (!email)
                cb(retErr);
            else
                helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/fetchMerchantDetails', 'POST', hdrs),
                    {
                        "userId": email
                    },
                    cb);
        }
        catch (err) {
            cb(retErr);
        }
    },

    getMerchantDetails: function (req, res) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body || !req.body.merchantCode)
                res.json(retErr);
            else {
                var d = req.body;
                var h = req.headers;
                helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/fetchMerchantDetails', 'POST', h),
                    {
                        "merchantCode": d.merchantCode
                    },
                    function (data) {
                        res.json(data);
                    });
            }
        }
        catch (err) {
            res.json(retErr);
        }
    },

    completeRegistration: function (req, res) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body || !req.body.id)
                res.json(retErr);
            else {
                var d = req.body;
                var h = req.headers;
                helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/completeRegistration', 'POST', h),
                    {
                        "id": d.id
                    },
                    function (data) {
                        res.json(data);
                    });
            }
        }
        catch (err) {
            res.json(retErr);
        }
    },

    getMerchantDetailsForVerification: function (req, res) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body || !req.body.secretCode)
                res.json(retErr);
            else {
                var d = req.body;
                var h = req.headers;
                helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/getParameters', 'POST', h),
                    {
                        "paramType": "registrationverification",
                        "paramCode": d.secretCode
                    }, function (data1) {
                        if (data1 && data1.desc1 && data1.desc2 && data1.val1) {
                            var dtdiff = Date.now() - data1.val1;
                            if (dtdiff > 3600000)
                                res.json({ isExpired: true });
                            else
                                helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/fetchMerchantDetails', 'POST', h),
                                    {
                                        "merchantCode": data1.desc1
                                    }, function (data2) {
                                        if (data2 && data2.merchantCode) {
                                            data2.agentCode = data1.desc2;
                                            helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/registration/sendWebOTP', 'POST', h),
                                                {
                                                    "mobileNumber": data2.mobileNumber
                                                },
                                                function (data3) {
                                                    if (data3 && data3.responseFromAPI == true)
                                                        res.json(data2);
                                                    else
                                                        res.json(retErr);
                                                });
                                        }
                                        else
                                            res.json(retErr);
                                    });
                        }
                        else
                            res.json(retErr);
                    });
            }
        }
        catch (err) {
            res.json(retErr);
        }
    },

    getCustomerList: function (req, res) {
        console.log('herelist')
        this.getCustomerListPost(req, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json(data);
        });
    },

    getCustomerListPost: function (req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body) {
                cb(retErr);
            }
            else {
                var d = req.body;
                if (d && d.merchantCode) {
                    helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/getCustomerList', 'POST', req.headers),
                        {
                            "merchantCode": d.merchantCode,
                            "pageNumber": d.pageNumber
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

    register: function (req, res) {
        var me = this;
        this.registerPost(req, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json(data);
        });
    },

    registerPost: function (req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body) {
                cb(retErr);
            }
            else {
                var d = req.body;
                if (d && d.mobileNumber && d.emailId && d.displayName && d.otp && d.fullName) {
                    helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/registerSelfMerchant', 'POST', req.headers),
                        {
                            "userId": d.emailId,
                            "mobileNumber": d.mobileNumber,
                            "emailId": d.emailId,
                            "password": d.password,
                            "displayName": d.displayName,
                            "contactPerson": d.fullName,
                            "source": d.source,
                            "otp": d.otp
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

    getLead: function (req, res) {
        var me = this;
        this.getLeadPost(req, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json(data);
        });
    },

    getLeadPost: function (req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body) {
                cb(retErr);
            }
            else {
                var d = req.body;
                if (d && d.mobileNumber) {
                    helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/getLead', 'POST', req.headers),
                        {
                            "mobileNumber": d.mobileNumber
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

    check: function (req, res) {
        var me = this;
        this.checkPost(req, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json(data);
        });
    },

    checkPost: function (req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body) {
                cb(retErr);
            }
            else {
                var d = req.body;
                if (d && d.mobileNumber) {
                    helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/checkMerchant', 'POST', req.headers),
                        {
                            "mobileNumber": d.mobileNumber
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

    verifyOTP: function (req, res) {
        var me = this;
        this.verifyOTPPost(req, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json(data);
        });
    },

    verifyOTPPost: function (req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body) {
                cb(retErr);
            }
            else {
                var d = req.body;
                if (d && d.mobileNumber && d.otp) {
                    helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/registration/checkWebOTP', 'POST', req.headers),
                        {
                            "mobileNumber": d.mobileNumber,
                            "otp": d.otp
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

    signUp: function (req, res) {
        var me = this;
        this.signUpPost(req, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json(data);
        });
    },

    signUpPost: function (req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body) {
                cb(retErr);
            }
            else {
                var d = req.body;
                if (d && d.mobileNumber) {
                    helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/registration/sendWebOTP', 'POST', req.headers),
                        {
                            "mobileNumber": d.mobileNumber
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

    signIn: function (req, res) {
        var retErr = {
            "success": false,
            "token": null,
            "errorCode": "Something went wrong. Please try again."
        };
        res.setHeader("X-Frame-Options", "DENY");
        var me = this;
        this.signInPost(req, function (data) {
            if (data && data.jwtToken) {
                res.json(data);
            }
            else if (data && data.validationErrors &&
                (data.validationErrors.user == 'User registration was not complete. Please register again.' ||
                    data.validationErrors.user == 'Your registration verification is pending. Please login once verification process is complete.')) {
                me.fetchMerchantDetailsPost(req.body.email, req.headers, function (unrData) {
                    if (unrData && unrData.success != false)
                        res.json({ "success": true, "merchant": unrData });
                    else
                        res.json(retErr);
                });
            }
            else {
                me.signInTilPost(req, function (empData) {
                    if (empData && empData.jwtToken && empData.employee_role &&
                        (empData.employee_role.trim().toLowerCase() == 'benow merchant associate'
                            || empData.employee_role.trim().toLowerCase() == 'benow merchant manager')) {
                        var ts = empData.jwtToken.split('.');
                        if (ts && ts.length > 1) {
                            var dt = JSON.parse(atob(ts[1]));
                            if (dt && dt.sub && dt.data) {
                                me.getTilsGet(dt.data.merchantCode, empData.jwtToken, dt.sub, function (tilData) {
                                    empData.tils = tilData;
                                    res.json(empData);
                                });
                            }
                            else
                                res.json(empData);
                        }
                        else
                            res.json(empData);
                    }
                    else {
                        res.json(empData);
                    }
                });
            }
        });
    },
    markSelfMerchantVerified: function (req, res) {
        var me = this;
        this.markSelfMerchantVerifiedpost(req, function (data) {
            // res.setHeader("X-Frame-Options", "DENY");

            res.json(data);
        });
    },

    markSelfMerchantVerifiedpost: function (req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        }

        try {
            if (!req || !req.body) {
                cb(retErr);
            }
            else {
                var d = req.body;
                console.log(d);
                if (d && d.id) {
                    helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/markSelfMerchantVerified', 'POST', req.headers),
                        {
                            "id": d.id,
                            "ifsc": d.ifsc,
                            "accountRefNumber": d.accountRefNumber,
                            "panNumber": d.panNumber,
                            "bankName": d.bankName,
                            "merchantName": d.merchantName,
                            "accountHolderName": d.accountHolderName,
                            "filePassword": d.filePassword
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
    registerSelfMerchant: function (req, res) {
        var me = this;
        this.registerSelfMerchantpost(req, function (data) {
            //res.setHeader("X-Frame-Options", "DENY");
            res.json(data);
        });
    },

    registerSelfMerchantpost: function (req, cb) {
        var retErr = {
            "success": false,

            "errorCode": "Something went wrong. Please try again."
        }

        try {
            if (!req || !req.body) {
                cb(retErr);
            }
            else {
                if (req.body && req.body.id) {
                    helper.postAndCallback(helper.getExtServerOptions('/merchants/merchant/registerSelfMerchant', 'POST', req.headers),
                        {
                            "gstNumber": req.body.gstNumber,
                            "businessName": req.body.businessName,
                            "businessType": req.body.businessType,
                            "contactEmailId": req.body.contactEmailId,
                            "category": req.body.category,
                            "subCategory": req.body.subCategory,
                            "city": req.body.city,
                            "locality": req.body.locality,
                            "contactPerson": req.body.contactPerson,
                            "contactMobileNumber": req.body.contactMobileNumber,
                            "address": req.body.address,
                            "pinCode": req.body.pinCode,
                            "businessTypeCode": req.body.businessTypeCode,
                            "businessType": req.body.businessType,
                            "id": req.body.id,
                            "numberOfOutlets": req.body.numberOfOutlets,
                            "agentId": req.body.agentId,
                            "contactPersonDesignation": req.body.contactPersonDesignation
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
    fetchMerchantForEditDetails: function (req, res) {
        var me = this;

        this.fetchMerchantForEditDetailsPost(req, function (data) {
            // console.log(data);
            var logoURL;
            if (data && data.documentResponseVO) {
                var p = data.documentResponseVO.documentList;
                if (p && p.length > 0) {
                    for (var i = 0; i < p.length; i++) {
                        if (p[i].documentName == 'Merchant_logo')
                            logoURL = p[i].documentUrl;

                    }
                }
            }

            if (data && logoURL) {
                me.downloadLogo(logoURL, data.userId, function (ldata) {
                    data.merchantLogoUrl = ldata;
                    res.setHeader("X-Frame-Options", "DENY");
                    res.json({ "data": data });
                });
            }
            else {
                res.setHeader("X-Frame-Options", "DENY");
                res.json({ "data": data });
            }
        });
    },
    fetchMerchantForEditDetailsPost: function (req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {

            if (!req || !req.body || !req.body.data)
                cb(retErr);
            else {

                if (req.body.userId)
                    helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/fetchMerchantForEditDetails', 'POST', req.headers),
                        {
                            "userId": req.body.userId,
                            "sourceId": req.body.sourceId,
                            "sourceType": req.body.sourceType
                        }, cb);
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },
    downloadLogo: function (url, userId, cb) {
        try {
            if (!url)
                cb('');
            else {
                var extn = '.png';
                var lIndex = url.lastIndexOf('.');
                if (lIndex > 0)
                    extn = url.substring(lIndex);

                var fName = 'logos/' + userId + extn;

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
        }
        catch (err) {
            cb('');
        }
    },
    setConvenienceFee: function (req, res) {
        var me = this;
        this.setConvenienceFeePost(req, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": data });
        });
    },
    setConvenienceFeePost: function (req, cb) {
        var retErr = {
            "success": false,
            "error": true,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body)
                cb(retErr);
            else {

                var d = req.body;
                if (d && d.id && d.chargeConvenienceFee != null && d.chargeConvenienceFee != undefined) {
                    helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/setConvenienceFeeFlag', 'POST', req.headers),
                        {
                            "chargeConvenienceFee": d.chargeConvenienceFee,
                            "id": d.id
                        },
                        cb);
                }
                else {
                    cb(retErr);
                }
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    getBusinessType: function (req, res) {
        var me = this;
        this.getBusinessTypeget(req, function (data) {

            res.setHeader("X-Frame-Options", "DENY")
            res.json({ "data": data });
        });
    },

    getBusinessTypeget: function (req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        }

        try {
            helper.getAndCallback(helper.getExtServerOptions('/merchants/merchant/getAllBusinessTypes', 'GET', req.headers), cb);
        }

        catch (err) {
            cb(retErr);
        }
    },
    getDashboardCategories: function (req, res) {
        var me = this;
        this.getDashboardCategoriespost(req, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": data });
        });
    },

    getDashboardCategoriespost: function (req, cb) {
        var retErr = {
            "success": false,

            "errorCode": "Something went wrong. Please try again."
        }

        try {
            if (!req || !req.body) {
                cb(retErr);
            }
            else {
                helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/getDashboardCategories', 'POST', req.headers),
                    {

                    },
                    cb);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    getSubcategoryByCategory: function (req, res) {
        var me = this;
        this.getSubcategoryByCategorypost(req, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": data });
        });
    },

    getSubcategoryByCategorypost: function (req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        }

        try {
            if (!req || !req.body) {
                cb(retErr);
            }
            else {

                var d = req.body.data;
                if (d && d.category) {
                    helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/getSubcategoryByCategory', 'POST', req.headers),
                        {
                            "category": d.category
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
    EnableKyc: function (req, res) {
        var me = this;
        this.EnableKycpost(req, function (data) {
            console.log(data);
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": data });
        })
    },


    EnableKycpost: function (req, cb) {
        var retErr = {
            "success": false,
            "error": true,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body)
                cb(retErr);
            else {

                var d = req.body;
                
                if (d && d.merchantCode)
                    helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/enableKyc', 'POST', req.headers),
                        {
                            "merchantCode": d.merchantCode,

                        },
                        cb);
                else cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },
    
    complteregister: function (req, res) {
        var me = this;
        this.complteregistrationpost(req, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": data });
        });
    },

    complteregistrationpost: function (req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        }

        try {
            if (!req || !req.body) {
                cb(retErr);
            }
            else {

                var d = req.body;
                if (d && d.id) {
                    helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/completeRegistration', 'POST', req.headers),
                        {
                            "id": d.id
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
 setLineOfBusiness: function (req, res) {
        var me = this;
        this.setLineOfBusinesspost(req, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": data });
        });
    },

setLineOfBusinesspost: function (req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        }

        try {
            if (!req || !req.body) {
                cb(retErr);
            }
            else {
                var d = req.body;
                if (d && d.id && d.businessLob) {
                    helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/setLineOfBusiness', 'POST', req.headers),
                        {
                            "id":d.id,
                            "businessLob":d.businessLob
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
}

module.exports = userCont;