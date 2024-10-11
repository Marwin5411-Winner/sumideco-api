const { where } = require("sequelize");
const db = require("../models");
const stripe = require("stripe")(
  process.env.NODE_ENV == "DEVELOPMENT"
    ? process.env.STRIPE_SK_SANDBOX_KEY
    : process.env.STRIPE_WEBHOOK_SECRET
);

exports.createConnectedAccount = async (req, res) => {
  if (!req.shop.id) {
    return res.status(400).json({
      error: "Shop Logged In nned : ShopId is required",
    });
  }

  try {
    const shop_secrets = await db.ShopSecret.findOne({
      where: { shop_id: req.shop.id },
    });

    if (!shop_secrets) {
      throw new Error(`ShopSecret not found for shopId: ${shopId}`);
    }

    if (!shop_secrets.stripe_connect_id) {
      const account = await stripe.accounts.create({});
      shop_secrets.stripe_connect_id = account.id;

      await shop_secrets.save();

      res.json({
        account: account.id,
      });
    } else {
      res.json({
        account: shop_secrets.stripe_connect_id,
      });
    }

  } catch (error) {
    console.error(
      "An error occurred when calling the Stripe API to create an account",
      error
    );
    res.status(500);
    res.send({ error: error.message });
  }
};

exports.accountLink = async (req, res) => {
  try {
    const { account } = req.body;

    console.log(req.body);

    const accountLink = await stripe.accountLinks.create({
      account: account,
      return_url: `${req.headers.origin}/account/return/${account}`,
      refresh_url: `${req.headers.origin}/account/refresh/${account}`,
      type: "account_onboarding",
    });

    res.json(accountLink);
  } catch (error) {
    console.error(
      "An error occurred when calling the Stripe API to create an account link:",
      error
    );
    res.status(500);
    res.send({ error: error.message });
  }
};


exports.accountSession = async (req, res) => {
  if (!req.shop.id) {
    return res.status(400).json({
      error: "Shop Logged In nned : ShopId is required",
    });
  }

  try {

    const shop_secrets = await db.ShopSecret.findOne({
      where: { shop_id: req.shop.id },
    });

    

      const accountSession = await stripe.accountSessions.create({
        account: shop_secrets.stripe_connect_id,
        components: {
          account_management: {
            enabled: true,
            features: {
              external_account_collection: true,
            },
          },
          balances: {
            enabled: true,
            features: {
              instant_payouts: true,
              standard_payouts: true,
              edit_payout_schedule: true,
            },
          },
          payments: {
            enabled: true,
            features: {
              refund_management: true,
              dispute_management: true,
              capture_payments: true,
            }
          },
          payouts: {
            enabled: true,
            features: {
              instant_payouts: true,
              standard_payouts: true,
              edit_payout_schedule: true,
              external_account_collection: true,
            },
          },
          payment_details: {
            enabled: true,
            features: {
              refund_management: true,
              dispute_management: true,
              capture_payments: true,
              destination_on_behalf_of_charge_management: false,
            },
          },
          documents: {
            enabled: true,
          },
        }
      });
  
      res.json({
        client_secret: accountSession.client_secret,
      });
    } catch (error) {
      console.error('An error occurred when calling the Stripe API to create an account session', error);
      res.status(500);
      res.send({error: error.message});
    }
}
