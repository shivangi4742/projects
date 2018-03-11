// Library inclusions.
var express = require('express');
var cartController = require('./../controllers/CartController');

// Initializations.
var cartRouter = express.Router();
cartRouter.post('/processPayment', cartController.processPayment.bind(cartController));
cartRouter.post('/startPaymentProcess', cartController.startPaymentProcess.bind(cartController));

module.exports = cartRouter;