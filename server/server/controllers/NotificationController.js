var helper = require('./../utils/Helper');

var notifCont = {    
    getNotifications: function (req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        this.getNotificationsPost(req, function (data) {
            res.json(data);
        });
    },

    getNotificationsPost: function(req, cb) {
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
                    helper.postAndCallback(helper.getExtServerOptions('/merchants/merchant/getMerchantMsgList', 'POST', req.headers),
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

module.exports = notifCont;