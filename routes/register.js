const express = require('express');
const router = express.Router();


const { createCustomer, createShop } = require('../modules/register');




/**
 * @swagger
 * /customers/{shopid}:
 * post:
 * summary: Create customer
 * tags: [customers]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * name:
 * type: string
 * email:
 * type: string
 * password:
 * type: string
 * required:
 * - name
 * - email
 * - password
 * responses:
 * 201:
 * description: Created
 * 400:
 * description: Bad Request
 * 500:
 * description: Internal Server Error
 */
router.post('/customer/:shopid', (req, res) => {
    // #swagger.tags = ['Customers']
    // #swagger.description = 'Create customer'
    createCustomer(req, res);
});

router.post('/shop', (req, res) => {
    // #swagger.tags = ['Shops']
    // #swagger.description = 'Create shop'
    createShop(req, res);
});



module.exports = router;