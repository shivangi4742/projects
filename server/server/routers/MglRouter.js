// Library inclusions.
var express = require('express');
var uuid = require('uuid');
var path = require('path');
// Class inclusions.
var urls = require('./../utils/URLs'); 
var MglController = require('./../controllers/MglController');
// Initializations.
var router = express.Router();
var isAuthenticated = function (req, res, next) {
    return next();
}

var resAuthenticated = function (req, res, next) {    
    return next();
};

router.post('/mgldetails', isAuthenticated, MglController.mglDetails.bind(MglController));
router.post('/mgldetailssave', isAuthenticated, MglController.mglDetailsSave.bind(MglController));

router.isAuthenticated = isAuthenticated;
router.resAuthenticated = resAuthenticated;
module.exports = router;