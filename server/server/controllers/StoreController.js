var helper = require('./../utils/Helper');

var storeCont = {    
    getStoreDetails: function(sturl, cb) {
        cb(null);
    },

    getMerchantDetailsFromURL: function(req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        this.getMerchantDetailsFromURLPost(req, function (data) {
            res.json(data);
        });
    },

    getMerchantDetailsFromURLPost: function(req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        }

        try {
            if (!req || !req.body)
                cb(retErr);
            else {
                var d = req.body;
                if (d && d.url) {
                    //d.url = 'https://pay-archana.benow.in/';//HARDCODED TO BE REMOVED
                    var u = d.url.toLowerCase().replace('https://', '').replace('http://', '').replace('.benow.in', '');
                    if(u.indexOf('pay-') == 0)
                        u = u.substring(4, u.length);

                    if(u.indexOf('/') > 0)
                        u = u.substring(0, u.indexOf('/'));
                    
                    helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/getMerchantUserByStroreUrl', 'POST', 
                        req.headers),
                        {
                            "storeUrl": u 
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

    getMerchantLogoPost: function(userId, id, hdrs, cb) {
        try {
            if (!userId || !id)
                cb(null);
            else {
                helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/fetchMerchantForEditDetails', 'POST', hdrs),
                    {
                        "userId": userId,
                        "sourceId": id.toString(),
                        "sourceType": "MERCHANT_REG"
                    }, function(m2Data) {
                        if (m2Data && m2Data.documentResponseVO && m2Data.documentResponseVO.documentList &&
                            m2Data.documentResponseVO.documentList.length > 0) {
                            var logo;
                            for (var i = 0; i < m2Data.documentResponseVO.documentList.length; i++) {
                                if (m2Data.documentResponseVO.documentList[i].documentCode &&
                                    m2Data.documentResponseVO.documentList[i].documentCode.toUpperCase() == 'LOGO') {
                                    logo = m2Data.documentResponseVO.documentList[i].documentUrl;
                                    if (logo && logo[0] != '/')
                                        logo = '/' + logo;

                                    break;
                                }
                            }

                            if (logo)
                                cb("https://mobilepayments.benow.in/merchants" + logo);
                            else
                                cb(null);
                        }
                        else
                            cb(null);
                    });
            }
        }
        catch (err) {
            cb(null);
        }        
    },

    saveMerchantURL: function(req, res) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        }

        try {
            if (!req || !req.body)
                cb(retErr);
            else {
                var d = req.body;
                if (d && d.id && d.url)
                    helper.postAndCallback(helper.getDefaultExtServerOptions('/merchants/merchant/saveMerchantStroreUrl', 'POST', req.headers),
                        {
                            "id": d.id,
                            "storeUrl": d.url.toLowerCase()
                        },
                        cb);
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }        
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