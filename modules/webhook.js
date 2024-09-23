const db = require('../models');
const { handleCheckoutSessionCompleted } = require('../functions/webhook');
const stripe = require('stripe')(process.env.STRIPE_SK_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;


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
      await handleCheckoutSessionCompleted(session);
    } else {
      console.warn(`Unhandled event type ${event.type}`);
    }
  
    res.json({ received: true });
}

