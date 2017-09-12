// Library inclusions.
var express = require('express');
var sdkController = require('./../controllers/SDKController');

// Initializations.
var sdkRouter = express.Router();
sdkRouter.post('/getPaymentLinkDetails', sdkController.getPaymentLinkDetails.bind(sdkController));
sdkRouter.post('/savePaymentLinkDetails', sdkController.savePaymentLinkDetails.bind(sdkController));
module.exports = sdkRouter;