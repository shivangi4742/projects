var helper = require('./../utils/Helper');

var storeCont = {    
    getStoreDetails: function(sturl, cb) {
        cb(null);
    },

    fetchStoreDetails: function(req, res) {
        var me = this;
        res.setHeader("X-Frame-Options", "ALLOW");
        this.fetchMerchantDetailsPost(req, function(data) {
            if(data && data.id && data.userId) {
                me.fetchMerchantAdditionalDetailsPost(req, data.id, data.userId, function(adata) {
                    var logoURL;
                    if (adata && adata.documentResponseVO) {
                        var p = adata.documentResponseVO.documentList;
                        if (p && p.length > 0) {
                            for (var i = 0; i < p.length; i++) {
                                if (p[i].documentName && p[i].documentName.trim().toUpperCase() == 'MERCHANT_LOGO')
                                    logoURL = p[i].documentUrl;
                            }
                        }
                    }

                    data.logoURL = logoURL;
                    res.json(data);
                })
            }
            else
                res.json(data);
        });
    },

    fetchMerchantAdditionalDetailsPost: function(req, mid, email, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        }

        try {
            if (!req || !req.body)
                cb(retErr);
            else {
                if (mid)
                    helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/fetchMerchantForEditDetails', 'POST', req.headers),
                    {
                        "userId": email,
                        "sourceId": mid,
                        "sourceType": 'MERCHANT_REG'
                    }, cb);
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }        
    },

    fetchMerchantDetailsPost: function(req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        }

        try {
            if (!req || !req.body)
                cb(retErr);
            else {
                var d = req.body;
                if (d && d.merchantCode)
                    helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/fetchMerchantDetails', 'POST', req.headers),
                        {
                            "merchantCode": d.merchantCode
                        },
                        cb);
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }        
    }
}

module.exports = storeCont;