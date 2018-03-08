// Library inclusions.
var express = require('express');
var storeController = require('./../controllers/StoreController');

// Initializations.
var storeRouter = express.Router();
storeRouter.post('/fetchStoreDetails', storeController.fetchStoreDetails.bind(storeController));

module.exports = storeRouter;