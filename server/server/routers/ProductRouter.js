// Library inclusions.
var express = require('express');
var productController = require('./../controllers/ProductController');

// Initializations.
var productRouter = express.Router();
productRouter.post('/addProduct', productController.addProduct.bind(productController));
productRouter.post('/editProduct', productController.editProduct.bind(productController));
productRouter.post('/getProducts', productController.getProducts.bind(productController));
productRouter.post('/deleteProduct', productController.deleteProduct.bind(productController));
productRouter.post('/getProductsForCampaign', productController.getProductsForCampaign.bind(productController));
productRouter.post('/getProductsForTransaction', productController.getProductsForTransaction.bind(productController));
module.exports = productRouter;