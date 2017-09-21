var helper = require('./../utils/Helper');

var transCont = {
    getTransactionProducts: function(hdrs, txns, counter, retTxns, cb) {
        var me = this;
        if(txns && txns.length > counter) {
            helper.postAndCallback(helper.getExtServerOptions('/payments/paymentadapter/getPayerProduct', 'POST', hdrs),
            {
                "payerId": helper.gandaLogic(txns[counter].payHistHdrTxnRefNo.toUpperCase())
            }, function(data) {
                if(data && data.length > 0) {
                    txns[counter].products = data;
                    if(!retTxns)
                        retTxns = new Array();
                    
                    retTxns.push(txns[counter]);
                }

                me.getTransactionProducts(hdrs, txns, ++counter, retTxns, cb);
            });

        }
        else
            cb(retTxns);
    },

    getNewProductTransactionsPost: function(req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };
        var me = this;
        try {
            if (!req || !req.body)
                cb(retErr);
            else {
                var d = req.body;
                var lastTxnId = d.lastTxnId;
                if (d && d.merchantCode)
                    helper.postAndCallback(helper.getExtServerOptions('/merchants/merchant/getFulfilledMerchantOrders', 'POST', req.headers),
                        {	
                            "merchantCode": d.merchantCode,
                            "fromDate": d.fromDate,
                            "toDate": d.toDate,
                            "pageNumber": d.pageNumber,
                            "status":d.status,
                            "sortColumn":d.sortColumn,
                            "sortDirection":d.sortDirection
                        }, function(data) {
                            if(data && data.orders && data.orders.length > 0) {
                                if(!lastTxnId)
                                    me.getTransactionProducts(req.headers, data.orders, 0, null, cb);
                                else {
                                    if(lastTxnId == data.orders[0].payHistHdrTxnRefNo)
                                        cb(null);
                                    else {
                                        var newOrders = new Array();
                                        for(var i = 0; i < data.orders.length; i++) {
                                            if(data.orders[i].payHistHdrTxnRefNo != lastTxnId)
                                                newOrders.push(data.orders[i]);
                                            else
                                                break;
                                        }

                                         me.getTransactionProducts(req.headers, newOrders, 0, null, cb);
                                    }
                                }
                            }
                            else
                                cb(null);
                        });
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    getProductTransactionsPost: function(req, cb) {
        var retErr = {
            "success": false,
            "errorCode": "Something went wrong. Please try again."
        };
        var me = this;
        try {
            if (!req || !req.body)
                cb(retErr);
            else {
                var d = req.body;
                if (d && d.merchantCode)
                    helper.postAndCallback(helper.getExtServerOptions('/merchants/merchant/getFulfilledMerchantOrders', 'POST', req.headers),
                        {	
                            "merchantCode": d.merchantCode,
                            "fromDate": d.fromDate,
                            "toDate": d.toDate,
                            "pageNumber": d.pageNumber,
                            "status":d.status,
                            "sortColumn":d.sortColumn,
                            "sortDirection":d.sortDirection
                        }, function(data) {
                            if(data && data.orders && data.orders.length > 0)
                                me.getTransactionProducts(req.headers, data.orders, 0, null, cb);
                            else
                                cb(null);
                        });
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    getProductTransactions: function (req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        this.getProductTransactionsPost(req, function (data) {
            res.json(data);
        }); 
    },

    getNewProductTransactions: function(req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        this.getNewProductTransactionsPost(req, function (data) {
            res.json(data);
        });         
    }
}

module.exports = transCont;