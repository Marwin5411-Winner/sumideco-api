var express = require('express');
var router = express.Router();
const webhook = require('../modules/webhook');

/* GET home page. */
// router.get('/', function(req, res, next) {

//   res.render('index', { title: 'Express' });
// });

router.get('/webhook/stripe', async (req, res, next) => {
    webhook.StripeWebhook(req, res);
});



module.exports = router;
