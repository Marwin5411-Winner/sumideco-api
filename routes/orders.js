const express = require('express');
const router = express.Router();

const orders = require('../modules/orders');
const { verifyShop } = require('../middleware/verifyShop');

/* GET Orders */
router.get('/:shopid', verifyShop, function(req, res, next) {
    // #swagger.tags = ['Orders']
    // #swagger.description = 'Get all orders'
    orders.getOrdersByShopId(req, res);
});

/* GET Orders by ID */
router.get('/:shopid/:id', verifyShop, function(req, res, next) {
    // #swagger.tags = ['Orders']
    // #swagger.description = 'Get order by id with shopid'
    orders.getOrderById(req, res);
});

/* POST create a new Order */
router.post('/:shopid', function(req, res, next) {
    // #swagger.tags = ['Orders']
    // #swagger.description = 'Create a new order'
    orders.createOrder(req, res);
});

/* PUT update a Order */
router.put('/:shopid/:id', verifyShop, function(req, res, next) {
    // #swagger.tags = ['Orders']
    // #swagger.description = 'Update a order'
    orders.updateOrder(req, res);
});

/* DELETE a Order */
router.delete('/:shopid/:id', verifyShop, function(req, res, next) {
    // #swagger.tags = ['Orders']
    // #swagger.description = 'Delete a order'
    orders.deleteOrder(req, res);
});



module.exports = router;