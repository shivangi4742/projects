// Library inclusions.
var express = require('express');
var campaignController = require('./../controllers/CampaignController');

// Initializations.
var campaignRouter = express.Router();
campaignRouter.post('/getCampaigns', campaignController.getCampaigns.bind(campaignController));
campaignRouter.post('/saveCampaign', campaignController.saveCampaign.bind(campaignController));
campaignRouter.post('/editCampaign', campaignController.editCampaign.bind(campaignController));
campaignRouter.post('/getCampaignURL', campaignController.getCampaignURL.bind(campaignController));
campaignRouter.post('/smsCampaignLink', campaignController.smsCampaignLink.bind(campaignController));
campaignRouter.post('/sendCampaignLink', campaignController.sendCampaignLink.bind(campaignController));
campaignRouter.post('/saveCampaignLink', campaignController.saveCampaignLink.bind(campaignController));
campaignRouter.post('/getCampaignsSummary', campaignController.getCampaignsSummary.bind(campaignController));
campaignRouter.post('/sendEmail', campaignController.sendEmail.bind(campaignController));
campaignRouter.post('/getAllNGOTransactions', campaignController.getAllNGOTransactions.bind(campaignController));
campaignRouter.post('/fetchMerchantDetails', campaignController.fetchMerchantDetails.bind(campaignController));
campaignRouter.post('/expirelink', campaignController.expirelink.bind(campaignController));

module.exports = campaignRouter;