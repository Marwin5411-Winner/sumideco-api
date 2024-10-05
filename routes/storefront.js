var express = require('express');
var router = express.Router();

const storefront = require('../modules/storefront');



router.get('/:shopid', (req, res) => {
    storefront.getStorefrontById(req, res);
})

router.put('/:shopid', (req, res) => {
    storefront.updateStorefrontById(req, res);
})

module.exports = router;