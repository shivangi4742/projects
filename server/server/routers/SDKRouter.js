// Library inclusions.
var express = require('express');
var sdkController = require('./../controllers/SDKController');

// Initializations.
var sdkRouter = express.Router();
sdkRouter.post('/createBill', sdkController.createBill.bind(sdkController));
sdkRouter.post('/processPayment', sdkController.processPayment.bind(sdkController));
sdkRouter.post('/createBillString', sdkController.createBillString.bind(sdkController));
sdkRouter.post('/startPaymentProcess', sdkController.startPaymentProcess.bind(sdkController));
sdkRouter.post('/getFundraiserDetails', sdkController.getFundraiserDetails.bind(sdkController));
sdkRouter.post('/getTransactionStatus', sdkController.getTransactionStatus.bind(sdkController));
sdkRouter.post('/getPaymentLinkDetails', sdkController.getPaymentLinkDetails.bind(sdkController));
sdkRouter.post('/saveCashPaymentSuccess', sdkController.saveCashPaymentSuccess.bind(sdkController));
sdkRouter.post('/updateFundraiserCollection', sdkController.updateFundraiserCollection.bind(sdkController));
sdkRouter.post('/getLogById', sdkController.getLogById.bind(sdkController));
sdkRouter.post('/createPaymentLink', sdkController.createPaymentLink.bind(sdkController));
sdkRouter.post('/getmerchantpaymentlink', sdkController.getmerchantpaymentlink.bind(sdkController));
module.exports = sdkRouter;