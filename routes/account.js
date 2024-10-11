const express = require("express");
const router = express.Router();

const account = require('../modules/account');


router.get('/', (req, res) => {
    account.getAccountIdByShopId(req, res);
})



module.exports = router;