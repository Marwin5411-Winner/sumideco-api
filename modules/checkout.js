const { where } = require("sequelize");
const db = require("../models");

const stripe = require("stripe")(
  "sk_test_51LYhWQE4XYqNk6elUkizaOmjZV44ejZ0narfmLX9mqfyeBguU7mXkReDKgsYTH8rBozVUrqRxldUTxR6kBjuYVMG000q8ShsIi"
);

exports.checkoutByOrder = async (req, res) => {
  try {
    const { order_id, success_url, cancel_url } = req.body;

    if (!order_id || !success_url || !cancel_url) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    // Fetch order details from your database
    const order = await db.Order.findOne({
      where: { id: order_id },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
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

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "promptpay"],
      line_items: lineItems,
      mode: "payment",
      success_url: success_url,
      cancel_url: cancel_url,
      metadata: {
        order_id: order_id,
      },
    });

    res.status(200).json({ session_url : session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res
      .status(500)
      .json({
        message: "Failed to create checkout session",
        error: error.message,
      });
  }
};
