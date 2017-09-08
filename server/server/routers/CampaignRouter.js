// Library inclusions.
var express = require('express');
var campaignController = require('./../controllers/CampaignController');

// Initializations.
var campaignRouter = express.Router();
campaignRouter.post('/getCampaigns', campaignController.getCampaigns.bind(campaignController));
campaignRouter.post('/getCampaignsSummary', campaignController.getCampaignsSummary.bind(campaignController));
module.exports = campaignRouter;