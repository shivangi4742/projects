// Library inclusions.
var express = require('express');
var sdkController = require('./../controllers/SDKController');

// Initializations.
var sdkRouter = express.Router();
sdkRouter.post('/createBill', sdkController.createBill.bind(sdkController));
sdkRouter.post('/processPayment', sdkController.processPayment.bind(sdkController));
sdkRouter.post('/createBillString', sdkController.createBillString.bind(sdkController));
sdkRouter.post('/startPaymentProcess', sdkController.startPaymentProcess.bind(sdkController));
sdkRouter.post('/getPaymentLinkDetails', sdkController.getPaymentLinkDetails.bind(sdkController));
module.exports = sdkRouter;