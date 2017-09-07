// Library inclusions.
var express = require('express');
var notificationController = require('./../controllers/NotificationController');

// Initializations.
var notificationRouter = express.Router();
notificationRouter.post('/getNotifications', notificationController.getNotifications.bind(notificationController));
module.exports = notificationRouter;