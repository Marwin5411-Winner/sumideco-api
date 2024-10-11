const express = require("express");
const router = express.Router();

const stripeModules = require("../modules/stripe");

//Create Account
router.post("/account", (req, res) => {
  stripeModules.createConnectedAccount(req, res);
});

router.post("/account_link", (req, res) => {
  stripeModules.accountLink(req, res);
});

router.post("/account_session", (req, res) => {
  stripeModules.accountSession(req, res);
})

module.exports = router;
