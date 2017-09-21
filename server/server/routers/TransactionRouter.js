// Library inclusions.
var express = require('express');
var transactionController = require('./../controllers/TransactionController');

// Initializations.
var trasnactionRouter = express.Router();
trasnactionRouter.post('/getProductTransactions', transactionController.getProductTransactions.bind(transactionController));
module.exports = trasnactionRouter;