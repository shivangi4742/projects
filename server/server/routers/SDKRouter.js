// Library inclusions.
var express = require('express');
var sdkController = require('./../controllers/SDKController');

// Initializations.
var sdkRouter = express.Router();
sdkRouter.post('/get80G/:id/:txnid', sdkController.get80G.bind(sdkController));
sdkRouter.post('/createBill', sdkController.createBill.bind(sdkController));
sdkRouter.post('/processPayment', sdkController.processPayment.bind(sdkController));
sdkRouter.post('/createBillString', sdkController.createBillString.bind(sdkController));
sdkRouter.post('/send80G/:id/:txnid', sdkController.send80GCertificate.bind(sdkController));
sdkRouter.post('/startPaymentProcess', sdkController.startPaymentProcess.bind(sdkController));
sdkRouter.post('/getFundraiserDetails', sdkController.getFundraiserDetails.bind(sdkController));
sdkRouter.post('/getTransactionStatus', sdkController.getTransactionStatus.bind(sdkController));
sdkRouter.post('/getPaymentLinkDetails', sdkController.getPaymentLinkDetails.bind(sdkController));
sdkRouter.post('/saveCashPaymentSuccess/:code', sdkController.saveCashPaymentSuccess.bind(sdkController));
sdkRouter.post('/updateFundraiserCollection', sdkController.updateFundraiserCollection.bind(sdkController));
sdkRouter.post('/getLogById', sdkController.getLogById.bind(sdkController));
sdkRouter.post('/createPaymentLink', sdkController.createPaymentLink.bind(sdkController));
sdkRouter.post('/getmerchantpaymentlink', sdkController.getmerchantpaymentlink.bind(sdkController));
sdkRouter.post('/razorpayCapturePayment', sdkController.razorpayCapturePayment.bind(sdkController));
sdkRouter.post('/razorpayConfirmPayment', sdkController.razorpayConfirmPayment.bind(sdkController));
sdkRouter.post('/getMerchantPaymentInfo', sdkController.getMerchantPaymentInfo.bind(sdkController));
sdkRouter.post('/getPaytmChecksum', sdkController.getPaytmChecksum.bind(sdkController));

module.exports = sdkRouter;