/**
 * @swagger
 *  tags:
 *    name: users
 *    description: users action (User mean Our Directly Company Customer)
 */

var express = require('express');
var router = express.Router();
const { createShop, getShops, getShopById, loginShop, updateShop } = require('../modules/shops');


/* GET shops listing. */
router.get('/', function(req, res, next) {
  // #swagger.tags = ['Shops']
  getShops(req, res);
});

/* GET user */
router.get('/:id', function(req, res, next) {
  // #swagger.tags = ['Shops']
  getShopById(req, res);
});

/* PUT update user. */
router.put('/update/:id', (req, res, next) => {
  // #swagger.tags = ['Shops']
  updateShop(req, res);
});

/* DELETE delete user. */
router.delete('/delete/:id', (req, res, next) => {
  // #swagger.tags = ['Shops']
  deleteShop(req, res);
});

router.post('/account_session', (req, res, next) => {
  
})






module.exports = router;
