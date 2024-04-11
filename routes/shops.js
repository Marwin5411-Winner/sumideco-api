/**
 * @swagger
 *  tags:
 *    name: users
 *    description: users action (User mean Our Directly Company Customer)
 */

var express = require('express');
var router = express.Router();
const { createShop, getShops, getShopById, loginShop } = require('../modules/shops');


/* GET shops listing. */
router.get('/shops', function(req, res, next) {
  // #swagger.tags = ['Shops']
  getShops(req, res);
});

/* GET user */
router.get('/shops/:id', function(req, res, next) {
  // #swagger.tags = ['Shops']
  getShopById(req, res);
});

/* POST create user. */
router.post('/shops/create', (req, res, next) => {
  // #swagger.tags = ['Shops']
  createShop(req, res);
});

/* PUT update user. */
router.put('/shops/update/:id', (req, res, next) => {
  // #swagger.tags = ['Shops']
  res.send('respond with a resource');
});

/* DELETE delete user. */
router.delete('/shops/delete/:id', (req, res, next) => {
  // #swagger.tags = ['Shops']
  res.send('respond with a resource');
});

/* POST Login user */
router.post('/shops/login', (req, res, next) => {
  // #swagger.tags = ['Shops']
  loginShop(req, res);
});




module.exports = router;
