const express = require("express")
const router = express.Router();
const Multer = require('multer');
const FirebaseStorage = require('multer-firebase-storage')
const systems = require('../modules/systems');


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

/* POST TEST FILES UPLOAD */
router.post('/upload', multer.any(), function(req, res, next) {
    // #swagger.tags = ['Test']
    systems.postTestUpload(req, res);
});

module.exports = router;