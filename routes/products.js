const express = require('express');
const router = express.Router();
const products = require('../modules/products');
const {verifyShop} = require('../middleware/verifyShop');


/* GET products list */
router.get('/products/:shopid', verifyShop, function(req, res, next) {
    // #swagger.tags = ['Products']
    products.getProducts(req, res);
});

/* GET Products by ID */
router.get('/products/:shopid/:id', verifyShop, function(req, res, next) {
    // #swagger.tags = ['Products']
    products.getProductById(req, res);
});

/* POST create a new product */
router.post('/products/:shopid', verifyShop, function(req, res, next) {
    // #swagger.tags = ['Products']
    products.createProduct(req, res);
});

/* PUT update a product */
router.put('/products/:shopid/:id', verifyShop, function(req, res, next) {
    // #swagger.tags = ['Products']
    products.updateProduct(req, res);
});

/* DELETE a product */
router.delete('/products/:shopid/:id', verifyShop, function(req, res, next) {
    // #swagger.tags = ['Products']
    products.deleteProduct(req, res);
});

router.get('/products/:shopid/:category', verifyShop,function(req, res, next) {
    // #swagger.tags = ['Products']
    products.getProductsByCategory(req, res);
});





module.exports = router;