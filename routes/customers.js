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
router.get('/:shopid', verifyShop, (req, res) => {
    // #swagger.tags = ['Customers']
    // #swagger.description = 'Get all customers'
    customers.getCustomersByShopId(req, res);
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
router.get('/:shopid/:id', verifyShop, (req, res) => {
    // #swagger.tags = ['Customers']
    // #swagger.description = 'Get customer by id with shopid'
    customers.getCustomerById(req, res);
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
router.put('/:shopid/:id', verifyShop,(req, res) => {
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
router.post('/login/:shopid', verifyShop, (req, res) => {
    // #swagger.tags = ['Customers']
    // #swagger.description = 'Login customer'
    customers.loginCustomer(req, res);
});


/**
 * @swagger
 * /customers/{shopid}/{id}:
 * delete:
 * summary: Delete customer by id from shop
 * tags: [customers]
 * responses:
 * 200:
 * description: Success
 * 400:
 * description: Bad Request
 * 500:
 * description: Internal Server Error
 */
router.delete('/:shopid/:id', verifyShop, (req, res) => {
    // #swagger.tags = ['Customers']
    // #swagger.description = 'Delete customer by id with shopid'
    customers.deleteCustomer(req, res);
});




//------------------------------- CART IN CUSTOMER ----------------------------------//
router.get('/:shopid/:id/carts', (req, res) => {
    // #swagger.tags = ['Carts']
    // #swagger.description = 'get Customer Carts'
    customers.getCartByCustomerId(req, res);
});

router.post('/:shopid/:id/carts', (req, res) => {
    // #swagger.tags = ['Carts']
    // #swagger.description = 'Add Item or Multiple Items to Cart'
    customers.addItemstoCartByCustomerId(req, res);
})

router.put('/:shopid/:id/carts', (req, res) => {
    // #swagger.tags = ['Carts']
    // #swagger.description = 'Update Customer Carts'
    customers.updateCartByCustomerId(req, res);
})

router.delete('/:shopid/:id/carts', (req, res) => {
    // #swagger.tags = ['Carts']
    // #swagger.description = 'Delete or Clear Customer Carts'
    customers.clearCartByCustomerId(req, res);
})







module.exports = router;