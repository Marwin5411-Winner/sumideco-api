const express = require("express");
const router = express.Router();

const checkout = require("../modules/checkout");


//Stripe
router.post("/createCheckoutSession", (req, res) => {
  checkout.checkoutByOrder(req, res);
});

// Omise endpoint
router.post("/charge", async (req, res) => {
  
});

module.exports = router;
