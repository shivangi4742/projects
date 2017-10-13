// Library inclusions.
var express = require('express');
var multer = require('multer');
var uuid = require('uuid');
var path = require('path');

// Class inclusions.
var urls = require('./../utils/URLs'); 
var beNowController = require('./../controllers/BeNowController');

// Initializations.
var router = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, uuid.v1() + file.originalname);
  }
});

var upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    var extn = path.extname(file.originalname);
    if(extn)
        extn = extn.toLowerCase();
    
    var mime = file.mimetype;
    if(mime)
        mime = mime.toLowerCase();

    if ((mime !== 'image/png' && mime !== 'image/jpg' && mime !== 'image/jpeg') || (extn !== '.jpg' && extn !== '.jpeg' && extn !== '.png')) {
        req.fileValidationError = 'Unsupported file format!';
        return cb(null, false)
    }

    cb(null, true);
  } 
});

var isAuthenticated = function (req, res, next) {
    return next();
/*    if (req.isAuthenticated()){
        return next();
    }
    res.redirect(urls.home);*/
}

var resAuthenticated = function (req, res, next) {    
    return next();
/*    if (req.isAuthenticated()){
        return next();
    }
    res.json({'status':0,'message':'session expired.','errorType':'1'});*/
};

router.post('/signIn', isAuthenticated, beNowController.signIn.bind(beNowController));
router.post('/download', isAuthenticated, beNowController.download.bind(beNowController));
router.post('/getTicker', isAuthenticated, beNowController.getTicker.bind(beNowController));
router.post('/tillRelease', isAuthenticated, beNowController.tillRelease.bind(beNowController));
router.post('/getMCheques', isAuthenticated, beNowController.getMCheques.bind(beNowController));
router.post('/getDynamicQR', isAuthenticated, beNowController.getDynamicQR.bind(beNowController));
router.post('/tillAllocate', isAuthenticated, beNowController.tillAllocate.bind(beNowController));
router.post('/getDefaultVPA', isAuthenticated, beNowController.getDefaultVPA.bind(beNowController));
router.post("/upload", upload.single("file", 12), beNowController.uploadFile.bind(beNowController));
router.post('/processPayment', isAuthenticated, beNowController.processPayment.bind(beNowController));
router.post('/getLastRequest', isAuthenticated, beNowController.getLastRequest.bind(beNowController));
router.post('/changePassword', isAuthenticated, beNowController.changePassword.bind(beNowController));
router.post('/getDueInvoices', isAuthenticated, beNowController.getDueInvoices.bind(beNowController));
router.post('/payWithMCheque', isAuthenticated, beNowController.payWithMCheque.bind(beNowController));
router.post('/savePaymentLink', isAuthenticated, beNowController.savePaymentLink.bind(beNowController));
router.post('/getTransactions', isAuthenticated, beNowController.getTransactions.bind(beNowController));
router.post('/getNotifications', isAuthenticated, beNowController.getNotifications.bind(beNowController));
router.post('/savePayerDetails', isAuthenticated, beNowController.savePayerDetails.bind(beNowController));
router.post('/getMChequeDetails', isAuthenticated, beNowController.getMChequeDetails.bind(beNowController));
router.post('/getPaymentDetails', isAuthenticated, beNowController.getPaymentDetails.bind(beNowController));
router.post('/getPaymentSummary', isAuthenticated, beNowController.getPaymentSummary.bind(beNowController));
router.post('/getDynamicQRString', isAuthenticated, beNowController.getDynamicQRString.bind(beNowController));
router.post('/sendCollectRequest', isAuthenticated, beNowController.sendCollectRequest.bind(beNowController));
router.post('/getAllTransactions', isAuthenticated, beNowController.getAllTransactions.bind(beNowController));
router.post('/getPPLTransactions', isAuthenticated, beNowController.getPPLTransactions.bind(beNowController));
router.post('/startPaymentProcess', isAuthenticated, beNowController.startPaymentProcess.bind(beNowController));
router.post('/sendVerificationMail', isAuthenticated, beNowController.sendVerificationMail.bind(beNowController));
router.post('/getDueMChequesByDate', isAuthenticated, beNowController.getDueMChequesByDate.bind(beNowController));
router.post('/getAllNGOTransactions', isAuthenticated, beNowController.getAllNGOTransactions.bind(beNowController));
router.post('/getAllPPLTransactions', isAuthenticated, beNowController.getAllPPLTransactions.bind(beNowController));


router.isAuthenticated = isAuthenticated;
router.resAuthenticated = resAuthenticated;
module.exports = router;