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

    signIn: function (req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        var me = this;
        this.signInPost(req, function (data) {
            if (data && data.jwtToken) {
                res.json(data);
            }
            else {
                me.signInTilPost(req, function (empData) {
                    if (empData && empData.jwtToken && empData.employee_role && 
                            empData.employee_role.trim().toLowerCase() == 'benow merchant associate') {
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