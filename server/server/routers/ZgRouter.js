// Library inclusions.
var express = require('express');
var zgController = require('./../controllers/ZgController');

// Initializations.
var zgRouter = express.Router();

var isAuthenticated = function (req, res, next) {
    return next();
}

zgRouter.post('/getPayPinDetails', isAuthenticated, zgController.getPayPinValues.bind(zgController));
zgRouter.post('/paytobill', isAuthenticated, zgController.payBill.bind(zgController));
zgRouter.post('/saveCharges', isAuthenticated, zgController.saveCharges.bind(zgController));
zgRouter.post('/updateAmount', isAuthenticated, zgController.updateAmount.bind(zgController));

zgRouter.isAuthenticated = isAuthenticated;

module.exports = zgRouter;