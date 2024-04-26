const express = require('express');
const router = express.Router();
const { loginShop, loginCustomer } = require('../modules/login');


//SHOP Login
router.post('/shop', function(req, res, next) {
    // #swagger.tags = ['Login']
    // #swagger.description = 'Shop Login'
    loginShop(req, res);
});

//CUSTOMER Login
router.post('/customer', function(req, res, next) {
    // #swagger.tags = ['Login']
    // #swagger.description = 'Customer Login'
    loginCustomer(req, res);
});


module.exports = router;