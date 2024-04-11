const express = require('express');
const router = express.Router();

const orders = require('../modules/orders');
const { verifyShop } = require('../middleware/verifyShop');

/* GET Orders */
router.get('/orders/:shopid', verifyShop, function(req, res, next) {
    // #swagger.tags = ['Orders']
    orders.getOrders(req, res);
});

/* GET Orders by ID */
router.get('/orders/:shopid/:id', verifyShop, function(req, res, next) {
    // #swagger.tags = ['Orders']
    orders.getOrderById(req, res);
});

/* POST create a new Order */
router.post('/orders/:shopid', verifyShop, function(req, res, next) {
    // #swagger.tags = ['Orders']
    orders.createOrder(req, res);
});

/* PUT update a Order */
router.put('/orders/:shopid/:id', verifyShop, function(req, res, next) {
    // #swagger.tags = ['Orders']
    orders.updateOrder(req, res);
});

/* DELETE a Order */
router.delete('/orders/:shopid/:id', verifyShop, function(req, res, next) {
    // #swagger.tags = ['Orders']
    orders.deleteOrder(req, res);
});



module.exports = router;