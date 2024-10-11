const db = require('../models');
const { handleCheckoutSessionCompleted } = require('../functions/webhook');
const stripe = require("stripe")((process.env.NODE_ENV == "DEVELOPMENT") ? process.env.STRIPE_SK_SANDBOX_KEY : process.env.STRIPE_SK_KEY);
const endpointSecret = (process.env.NODE_ENV == "DEVELOPMENT") ? process.env.STRIPE_SANDBOX_WEBHOOK_SECRET : process.env.STRIPE_WEBHOOK_SECRET;


exports.StripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;
  
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  
    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log(session)
      // Fulfill the purchase
      await handleCheckoutSessionCompleted(session.metadata.order_id, session);
    } else {
      console.warn(`Unhandled event type ${event.type}`);
    }
  
    res.json({ received: true });
}

