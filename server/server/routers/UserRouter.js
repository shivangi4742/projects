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
userRouter.post('/markSelfMerchantVerified', userController.markSelfMerchantVerified.bind(userController));
userRouter.post('/registerSelfMerchant', userController.registerSelfMerchant.bind(userController));
userRouter.post('/fetchMerchantForEditDetails', userController.fetchMerchantForEditDetails.bind(userController));
userRouter.post('/setConvenienceFee',userController.setConvenienceFee.bind(userController));
userRouter.get('/getBusinessType', userController.getBusinessType.bind(userController));
userRouter.post('/getDashboardCategories',  userController.getDashboardCategories.bind(userController));
userRouter.post('/getSubcategoryByCategory', userController.getSubcategoryByCategory.bind(userController));
userRouter.post('/EnableKyc', userController.EnableKyc.bind(userController));
userRouter.post('/complteregister', userController.complteregister.bind(userController));


module.exports = userRouter;