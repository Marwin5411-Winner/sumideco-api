const express = require('express');
const router = express.Router();

const checkout = require('../modules/checkout');

router.post('/createCheckoutSession', (req, res) => {
    checkout.checkoutByOrder(req, res);
})

module.exports = router;