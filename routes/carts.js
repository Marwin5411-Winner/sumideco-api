const express = require('express');
const router = express.Router();


/* GET cart item list by customer id */
router.get('/carts/:shopid/:customerid', function(req, res, next) {
    // #swagger.tags = ['Carts']
    res.send('respond with a resource');
});

/* Add Item to Cart */
router.post('/carts/:shopid/:customerid', function(req, res, next) {
    // #swagger.tags = ['Carts']
    res.send('respond with a resource');
});

/* Update Item List in Cart */
router.put('/carts/:shopid/:customerid', function(req, res, next) {
    // #swagger.tags = ['Carts']
    res.send('respond with a resource');
});


/* Delete Item in Cart */
router.delete('/carts/:shopid/:customerid/:productid', function(req, res, next) {
    // #swagger.tags = ['Carts']
    res.send('respond with a resource');
});








module.exports = router;