const express = require('express');
const router = express.Router();
const products = require('../modules/products');
const {verifyShop} = require('../middleware/verifyShop');


/* GET products list */
router.get('/:shopid', verifyShop, function(req, res, next) {
    // #swagger.tags = ['Products']
    products.getProductsByShopId(req, res);
});

/* GET Products by ID */
router.get('/:shopid/:id', verifyShop, function(req, res, next) {
    // #swagger.tags = ['Products']
    products.getProductById(req, res);
});

/* POST create a new product */
router.post('/:shopid', verifyShop, function(req, res, next) {
    // #swagger.tags = ['Products']
    products.createProduct(req, res);
});

/* PUT update a product */
router.put('/:shopid/:id', verifyShop, function(req, res, next) {
    // #swagger.tags = ['Products']
    products.updateProduct(req, res);
});

/* DELETE a product */
router.delete('/:shopid/:id', verifyShop, function(req, res, next) {
    // #swagger.tags = ['Products']
    products.deleteProduct(req, res);
});

router.get('/:shopid/:category', verifyShop,function(req, res, next) {
    // #swagger.tags = ['Products']
    products.getProductsByCategory(req, res);
});





module.exports = router;