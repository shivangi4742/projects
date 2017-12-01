var helper = require('./../utils/Helper');

var helpCont = {    
    getHelpTexts: function (req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        this.getHelpTextsPost(req, function (data) {
            res.json(data);
        });
    },

    getHelpTextsPost: function(req, cb) {
        var retErr = {
            "success": true,
            "errorCode": "Not able to get help."
        };

        var pcode = '0';
        if(req.body.mtype == 2)
            pcode = '1';

        try {
            helper.postAndCallback(helper.getExtServerOptions('/merchants/merchant/getParameters', 'POST', req.headers),
                {
                    "paramType": "help",
                    "paramCode": pcode
                }, cb);
        }
        catch (err) {
            cb(retErr);
        }        
    }
}

module.exports = helpCont;