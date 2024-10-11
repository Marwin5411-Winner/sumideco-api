const express = require('express');
const router = express.Router();

const recipients = require('../modules/recipients')


//Get Recipient
router.get('/:shopid', (req, res) => {
    recipients.getRecipientByShopId(req, res);
})

//Create Recipient
router.post('/create', (req, res) => {
    recipients.createRecipientByShopId(req, res);
});


module.exports = router;