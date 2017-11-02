var helper = require('./../utils/Helper');

var transCont = {
    getNextPage: function(req, data, page, cb) {
        var me = this;
        if(data && data.noOfPages > page && page <= 10) {
            req.body.pageNumber++;
            this.getProductTransactionsPost(req, function(d2) {
                if(d2 && d2.orders && d2.orders.length > 0)
                    for(var i = 0; i < d2.orders.length; i++)
                        data.orders.push(d2.orders[i]);

                me.getNextPage(req, data, req.body.pageNumber, cb);
            });
        }
        else
            cb(data);
    },

    getTransactionDetailsPost: function(req, cb) {
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
                if(d && d.merchantCode && d.txnId)
                    helper.postAndCallback(helper.getDefaultExtServerOptions('/payments/ecomm/getMerchantTransactionStatus', 'POST', req.headers),
                        {	
                            "merchantCode": d.merchantCode,
                            "txnId": d.txnId
                        }, function(data) {
                            cb(data)
                        });
                else
                    cb(retErr);                    
            }
        }
        catch (err) {
            cb(retErr);
        }        
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
                    helper.postAndCallback(helper.getExtServerOptions('/merchants/merchant/getPaymentsAndOrders', 'POST', req.headers),
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
                                    cb(data);
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

                                        data.orders = newOrders;
                                        cb(data);
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

    getAllProductTransactionsPost(req, cb) {
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
                if (d && d.merchantCode) {
                    req.body.pageNumber = 1;
                    this.getProductTransactionsPost(req, function(data) {
                        if(data && data.noOfPages > 0)
                            me.getNextPage(req, data, 1, cb);
                        else
                            cb(data);
                    });
                }
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
                    helper.postAndCallback(helper.getExtServerOptions('/merchants/merchant/getPaymentsAndOrders', 'POST', req.headers),
                        {	
                            "merchantCode": d.merchantCode,
                            "fromDate": d.fromDate,
                            "toDate": d.toDate,
                            "pageNumber": d.pageNumber,
                            "status":d.status,
                            "sortColumn":d.sortColumn,
                            "sortDirection":d.sortDirection
                        }, function(data) {
                            cb(data);
                        });
                else
                    cb(retErr);
            }
        }
        catch (err) {
            cb(retErr);
        }
    },

    getAllProductTransactions: function (req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        this.getAllProductTransactionsPost(req, function (data) {
            res.json(data);
        }); 
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
    },

    getTransactionDetails: function(req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        this.getTransactionDetailsPost(req, function (data) {
            res.json(data);
        });         
    }
}

module.exports = transCont;