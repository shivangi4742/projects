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

    fetchMerchantDetailsPost: function(email, hdrs, cb) {
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
                            "userId":d.emailId,
	                        "mobileNumber":d.mobileNumber,
	                        "emailId":d.emailId,
	                    	"password":d.password,
                            "displayName":d.displayName,
                            "contactPerson": d.fullName,
                            "source":d.source,
                            "otp":d.otp
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
                me.fetchMerchantDetailsPost(req.body.email, req.headers, function(unrData) {
                    if(unrData && unrData.success != false)
                        res.json({ "success": true, "merchant": unrData});
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
}

module.exports = userCont;