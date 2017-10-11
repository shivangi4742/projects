// Library inclusions.
var express = require('express');
var transactionController = require('./../controllers/TransactionController');

// Initializations.
var trasnactionRouter = express.Router();
trasnactionRouter.post('/getProductTransactions', transactionController.getProductTransactions.bind(transactionController));
trasnactionRouter.post('/getAllProductTransactions', transactionController.getAllProductTransactions.bind(transactionController));
trasnactionRouter.post('/getNewProductTransactions', transactionController.getNewProductTransactions.bind(transactionController));
module.exports = trasnactionRouter;