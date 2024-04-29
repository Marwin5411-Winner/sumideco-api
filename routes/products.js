const express = require('express');
const router = express.Router();
const products = require('../modules/products');
const {verifyShop} = require('../middleware/verifyShop');
const Multer = require('multer');
const FirebaseStorage = require('multer-firebase-storage')


const multer = Multer({
    storage: FirebaseStorage({
      bucketName: process.env.FIREBASE_BUCKET_NAME,
      directoryPath: 'products',
      credentials: {
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        projectId: process.env.FIREBASE_PROJECT_ID
      },
      public: true
    })
  })



/* GET products list */
router.get('/:shopid', verifyShop, function(req, res, next) {
    // #swagger.tags = ['Products']
    products.getProductsByShopId(req, res);
});

/* GET Products by ID */
router.get('/:shopid/:id', verifyShop, function(req, res, next) {
    // #swagger.tags = ['Products']
    products.getProductById(req, res);
});

/* POST create a new product */
router.post('/:shopid', verifyShop, multer.any(), function(req, res, next) {
    // #swagger.tags = ['Products']
    products.createProduct(req, res);
});

/* PUT update a product */
router.put('/:shopid/:id', verifyShop, multer.any(), function(req, res, next) {
    // #swagger.tags = ['Products']
    products.updateProduct(req, res);
});

/* DELETE a product */
router.delete('/:shopid/:id', verifyShop, function(req, res, next) {
    // #swagger.tags = ['Products']
    products.deleteProduct(req, res);
});

router.get('/:shopid/:category', verifyShop,function(req, res, next) {
    // #swagger.tags = ['Products']
    products.getProductsByCategory(req, res);
});





module.exports = router;