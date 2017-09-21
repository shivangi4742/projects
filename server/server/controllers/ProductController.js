var helper = require('./../utils/Helper');

var prodCont = {    
    addProduct: function (req, res) {
         res.setHeader("X-Frame-Options", "DENY");
        this.addProductPost(req, function (data) {
            res.json(data);
        }); 
    },

    addProductPost: function(req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body)
                cb(retErr);
            else {
                var d = req.body;
                if (d && d.merchantCode && d.price && d.name)
                    helper.postAndCallback(helper.getExtServerOptions('/merchants/merchant/saveBenowProduct', 'POST', req.headers),
                        {	
                            "merchantCode": d.merchantCode,
                            "prodPrice": d.price,
                            "prodDescription": d.description,
                            "prodImgUrl": d.imageURL,
                            "prodName": d.name,
                            "uom": d.uom
                        }, cb);
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    getProductsForTransaction: function (req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        this.getProductsForTransactionPost(req, function (data) {
            res.json(data);
        });
    },

    getProductsForTransactionPost: function(req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body)
                cb(retErr);
            else {
                var d = req.body;
                if (d && d.transactionId)
                    helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/getPayerProduct', 'POST', req.headers),
                        {
                            "payerId": helper.gandaLogic(d.transactionId.toUpperCase())
                        }, cb);
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    getProductsForCampaign: function (req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        this.getProductsForCampaignPost(req, function (data) {
            res.json(data);
        });
    },

    getProducts: function (req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        this.getProductsPost(req, function (data) {
            res.json(data);
        });
    },

    getProductsForCampaignPost: function(req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body)
                cb(retErr);
            else {
                var d = req.body;
                if (d && d.merchantCode && d.campaignId)
                    helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/getCampaignProduct', 'POST', req.headers),
                        {
                            "merchantCode": d.merchantCode,
                            "txnRefNumber": d.campaignId
                        }, cb);
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    getProductsPost: function(req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body)
                cb(retErr);
            else {
                var d = req.body;
                if (d && d.merchantCode)
                    helper.postAndCallback(helper.getExtServerOptions('/merchants/merchant/getBenowProduct', 'POST', req.headers),
                        {
                            "merchantCode": d.merchantCode
                        }, cb);
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    }
}

module.exports = prodCont;