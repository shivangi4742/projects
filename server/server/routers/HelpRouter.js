// Library inclusions.
var express = require('express');
var helpController = require('./../controllers/HelpController');

// Initializations.
var helpRouter = express.Router();
helpRouter.post('/getHelpTexts', helpController.getHelpTexts.bind(helpController));

module.exports = helpRouter;