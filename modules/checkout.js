const { where } = require("sequelize");
const db = require("../models");
const { handleCheckoutSessionCompleted } = require("../functions/webhook");


const stripe = require("stripe")((process.env.NODE_ENV == "DEVELOPMENT") ? process.env.STRIPE_SK_SANDBOX_KEY : process.env.STRIPE_WEBHOOK_SECRET);

const secretKey = process.env.OMISE_SECRET_KEY;

exports.checkoutByOrder = async (req, res) => {
  try {
    const { order_id, success_url, cancel_url } = req.body;

    if (!order_id || !success_url || !cancel_url) {
      return res.status(400).json({  error: "Missing required parameters" });
    }

    // Fetch order details from your database
    const order = await db.Order.findOne({
      where: { id: order_id },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const shop_secrets = await db.ShopSecret.findOne({
      where: { shop_id : order.shop_id }
    });

    if (!shop_secrets) {
      return res.status(404).json({ error: "Shop not found" });
    }


    if (!shop_secrets.stripe_connect_id) {
      return res.status(404).json({ error: "Shop Account not found" });
    }


    console.log(JSON.stringify(order.item_list));

    const products = JSON.parse(order.item_list);

    console.log(products);

    // Fetch detailed product information
    const detailedProducts = await Promise.all(
      products.map(async (item) => {
        const productDetails = await db.Product.findOne({
          where: {
            id: item.product_id,
          },
        });
        if (!productDetails) {
          throw new Error(`Product not found: ${item.product_id}`);
        }
        // Convert to plain object
        const productData = productDetails.get({ plain: true });
        return {
          ...productData,
          quantity: item.quantity,
        };
      })
    );

    console.log(detailedProducts[0].id);

    // Map to Stripe line items
    const lineItems = detailedProducts.map((product) => ({
      price_data: {
        currency: "thb",
        product_data: {
          name: product.name,
        },
        unit_amount: parseInt(product.price * 100),
      },
      quantity: product.quantity,
    }));
    console.log(lineItems);

    const PlatformFee = order.platformFee * 100;

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "promptpay"],
      line_items: lineItems,
      payment_intent_data: {
        application_fee_amount: PlatformFee || 1000,
      },
      mode: "payment",
      success_url: success_url,
      cancel_url: cancel_url,
      metadata: {
        order_id: order_id,
      },
    },
  {
    stripeAccount: shop_secrets.stripe_connect_id
  });

    res.status(200).json({ session_url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({
      message: "Failed to create checkout session",
      error: error.message,
    });
  }
};

exports.charge = async (req, res) => {
  console.log(req.body);

  const orderId = req.body.order_id;
  const token = req.body.token;

  if (!secretKey || !token) {
    return res.status(400).json({ error: "Missing secret key or token" });
  }

  try {
    const response = await fetch("https://api.omise.co/sources/" + token, {
      method: "GET",
      headers: {
        Authorization:
          "Basic " + Buffer.from(secretKey + ":").toString("base64"),
      },
    });

    if (!response.ok) {
      throw new Error(
        "Error fetching data from Omise API: " + response.statusText
      );
    }

    const data = await response.json();

    // data.charge_status <- if Charge status is successful then update order status
    if (data.charge_status == "successful") {
      await handleCheckoutSessionCompleted(orderId);
    }

    const order = db.Order.findOne({
      where: { id: orderId }
    })

    console.log(data);
    return res.status(200).json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
