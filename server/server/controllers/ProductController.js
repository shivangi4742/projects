var helper = require('./../utils/Helper');

var prodCont = {    
    addProduct: function (req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        this.addProductPost(req, function (data) {
            res.json(data);
        }); 
    },

    editProduct: function (req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        this.editProductPost(req, function (data) {
            res.json(data);
        }); 
    },

    deleteProduct: function (req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        this.deleteProductPost(req, function (data) {
            res.json(data);
        }); 
    },

    deleteCampaignProduct: function(req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        this.deleteCampaignProductPost(req, function (data) {
            console.log(data);
            res.json(data);
        }); 
    },

    editProductPost: function(req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body)
                cb(retErr);
            else {
                var d = req.body;
                if (d && d.id && d.merchantCode && d.price && d.name)
                    helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/editBenowProduct', 'POST', req.headers),
                        {
                            "id": d.id,	
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

    deleteCampaignProductPost: function(req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body)
                cb(retErr);
            else {
                var d = req.body;
                if (d && d.id)
                    helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/paymentadapter/deleteCampaignProduct', 'POST', req.headers),
                        {	
                            "id": d.id
                        }, cb);
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    deleteProductPost: function(req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };

        try {
            if (!req || !req.body)
                cb(retErr);
            else {
                var d = req.body;
                if (d && d.id)
                    helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/deleteBenowProduct', 'POST', req.headers),
                        {	
                            "id": d.id
                        }, cb);
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
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
                    helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/saveBenowProduct', 'POST', req.headers),
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
                            "transactionRef": d.transactionId
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
                    helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/getBenowProduct', 'POST', req.headers),
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
    }
}

module.exports = prodCont;