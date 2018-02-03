// Library inclusions.
var express = require('express');
var userController = require('./../controllers/UserController');

// Initializations.
var userRouter = express.Router();
userRouter.post('/check', userController.check.bind(userController));
userRouter.post('/signIn', userController.signIn.bind(userController));
userRouter.post('/signUp', userController.signUp.bind(userController));
userRouter.post('/getLead', userController.getLead.bind(userController));
userRouter.post('/register', userController.register.bind(userController));
userRouter.post('/verifyOTP', userController.verifyOTP.bind(userController));
userRouter.post('/completeRegistration', userController.completeRegistration.bind(userController));
userRouter.post('/getCustomerList', userController.getCustomerList.bind(userController));
userRouter.post('/getMerchantDetails', userController.getMerchantDetails.bind(userController));
userRouter.post('/getMerchantDetailsForVerification', userController.getMerchantDetailsForVerification.bind(userController));
module.exports = userRouter;