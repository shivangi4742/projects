var helper = require('./../utils/Helper');

var prodCont = {    
    addProduct: function (req, res) {
        /* res.setHeader("X-Frame-Options", "DENY");
        this.addProductPost(req, function (data) {
            res.json(data);
        }); */
    },

    getProducts: function (req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        this.getProductsPost(req, function (data) {
            res.json(data);
        });
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