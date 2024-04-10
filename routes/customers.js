/**
 * @swagger
 *  tags:
 *    name: customers
 *    description: users action
 */

var express = require('express');
var router = express.Router();

const customers = require('../modules/customers');

//Custom Middleware
const { verifyShop } = require('../middleware/verifyShop');


/**
 * @swagger
 * /customers/{shopid}:
 * get:
 * summary: Get all customers
 * tags: [customers]
 * responses:
 * 200:
 * description: Success
 * 400:
 * description: Bad Request
 * 500:
 * description: Internal Server Error
 */
router.get('/customers/:shopid', verifyShop, (req, res) => {
    // #swagger.tags = ['Customers']
    // #swagger.description = 'Get all customers'
    customers.getCustomers(req, res);
});

/**
 * @swagger
 * /customers/{shopid}/{id}:
 * get:
 * summary: Get customer by id from shop
 * tags: [customers]
 * responses:
 * 200:
 * description: Success
 * 400:
 * description: Bad Request
 * 500:
 * description: Internal Server Error
 */
router.get('/customers/:shopid/:id', verifyShop, (req, res) => {
    // #swagger.tags = ['Customers']
    // #swagger.description = 'Get customer by id with shopid'
    customers.getCustomerById(req, res);
});

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
router.post('/customers/:shopid', verifyShop, (req, res) => {
    // #swagger.tags = ['Customers']
    // #swagger.description = 'Create customer'
    customers.createCustomer(req, res);
});

/**
 * @swagger
 * /customers/{shopid}/{id}:
 * put:
 * summary: Update customer by id from shop
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
 * 200:
 * description: Success
 * 400:
 * description: Bad Request
 * 500:
 * description: Internal Server Error
 */
router.put('/customers/:shopid/:id', verifyShop,(req, res) => {
    // #swagger.tags = ['Customers']
    // #swagger.description = 'Update customer by id with shopid'
    customers.updateCustomer(req, res);
});

/**
 * @swagger
 * /customers/{shopid}:
 * post:
 * summary: Login customer
 * tags: [customers]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * email:
 * type: string
 * password:
 * type: string
 * required:
 * - email
 * - password
 * responses:
 * 200:
 * description: Success
 * 400:
 * description: Bad Request
 * 500:
 * description: Internal Server Error
 */
router.post('/customers/login/:shopid', verifyShop, (req, res) => {
    // #swagger.tags = ['Customers']
    // #swagger.description = 'Login customer'
    customers.loginCustomer(req, res);
});







module.exports = router;