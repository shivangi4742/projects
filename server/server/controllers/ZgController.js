var helper = require('./../utils/Helper');
var config = require('./../configs/Config');
var request = require('request');

var zgCont = {

    getToken(req) {
        if (req.headers) {
            if (req.headers['X-AUTHORIZATION'])
                return (req.headers['X-AUTHORIZATION']).toString();
            else if (req.headers['x-authorization'])
                return (req.headers['x-authorization']).toString();
        }

        return '';
    },

    getPayPinValues: function (req, res) {
        this.getPayPinValuesPost(req, function (data) {
            res.json({ "data": data });
        });
    },

    getPayPinValuesPost: function (req, cb) {
        var retErr = {
            "success": false,
            "token": null,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            paypin = req.body.paypin;

            request.get({
                url: 'https://api.app.zipgrid.com/benow/getPayPinValues?paypin=' + paypin,
                headers: {
                    "Content-Type": "application/json"
                },

            }, function (error, response, body) {
                if (error) {
                    console.log(error);
                }

                cb(response.body);

            });

        }
        catch (err) {
            cb(retErr);
        }
    },


    payBill: function (req, res) {
        this.payBillPost(req, function (data) {
            res.json({ "data": data });
        });
    },

    payBillPost: function (req, cb) {
        var retErr = {
            "success": false,
            "token": null,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            request({
                url: 'https://api.app.zipgrid.com/benow/paytobill',
                method: "POST",
                json: req.body.data
            }
                , function (error, response, body) {
                    if (error) {
                        console.log(error);
                    }
                    cb(response.body);
                });
        }
        catch (err) {
            cb(retErr);
        }
    },

    updateAmount: function (req, res) {
        var token = this.getToken(req);
        var me = this;
        this.updateAmountPost(req, token, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": data });
        });
    },

    updateAmountPost: function (req, token, cb) {
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
                    helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/updatePortablePaymentRequest', 'POST', req.headers),
                        {
                            "refNumber": d.payLinkId,
                            "amount": d.amount
                        }, cb);

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

    saveCharges: function (req, res) {
        var token = this.getToken(req);
        var me = this;
        this.saveChargesPost(req, token, function (data) {
            res.setHeader("X-Frame-Options", "DENY");
            res.json({ "data": data });
        });
    },

    saveChargesPost: function (req, token, cb) {
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
                            "transactionRef": d.transactionRef,
                            "actionData": d.actionData,
                            "tag1": d.tag1,
                            "tag2": d.tag2,
                            "tag3": d.tag3,
                            "val1": d.val1,
                            "val2": d.val2,
                            "val3": d.val3
                        }, cb);

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

}

module.exports = zgCont;