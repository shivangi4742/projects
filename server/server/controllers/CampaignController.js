var helper = require('./../utils/Helper');

var campCont = {    
    getCampaignsSummary: function (req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        this.getCampaignsSummaryPost(req, function (data) {
            res.json(data);
        });
    },

    getCampaignsSummaryPost: function(req, cb) {
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
                    helper.postAndCallback(helper.getExtServerOptions('/payments/paymentadapter/getCampaignSummary', 'POST', req.headers),
                        {
                            "merchantCode": d.merchantCode,
                            "fromDate": d.fromDate,
                            "toDate": d.toDate
                        }, cb);
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    getCampaigns: function (req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        this.getCampaignsPost(req, function (data) {
            res.json(data);
        });
    },

    getCampaignsPost: function(req, cb) {
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
                    helper.postAndCallback(helper.getExtServerOptions('/payments/paymentadapter/getCampaignDetails', 'POST', req.headers),
                        {
                            "merchantCode": d.merchantCode,
                            "fromDate": d.fromDate,
                            "toDate": d.toDate
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

module.exports = campCont;