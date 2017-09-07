// Library inclusions.
var express = require('express');
var userController = require('./../controllers/UserController');

// Initializations.
var userRouter = express.Router();
userRouter.post('/signIn', userController.signIn.bind(userController));
module.exports = userRouter;