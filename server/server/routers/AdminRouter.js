// Library inclusions.
var express = require('express');
var adminController = require('./../controllers/AdminController');

// Initializations.
var adminRouter = express.Router();

var isAdminAuthenticated = function (req, res, next) {
    return next();
}

var resAdminAuthenticated = function (req, res, next) {    
    return next();
};

adminRouter.post('/saveTicker', isAdminAuthenticated, adminController.saveTicker.bind(adminController));

adminRouter.isAdminAuthenticated = isAdminAuthenticated;
adminRouter.resAdminAuthenticated = resAdminAuthenticated;
module.exports = adminRouter;