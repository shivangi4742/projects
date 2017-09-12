// Library inclusions.
var express = require('express');
var productController = require('./../controllers/ProductController');

// Initializations.
var productRouter = express.Router();
productRouter.post('/addProduct', productController.addProduct.bind(productController));
productRouter.post('/getProducts', productController.getProducts.bind(productController));
module.exports = productRouter;