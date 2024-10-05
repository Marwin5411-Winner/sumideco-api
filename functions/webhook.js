const db = require('../models');


async function handleCheckoutSessionCompleted(session) {
  try {
    // Extract order ID from session metadata
    const orderId = session.metadata.order_id;

    if (!orderId) {
      console.error('Order ID not found in session metadata');
      return;
    }

    // Fetch the order from your database
    const order = await db.Order.findOne({ where: { id: orderId } });

    if (!order) {
      console.error(`Order not found: ${orderId}`);
      return;
    }

    // Update order status to 'paid'
    order.status = 'paid';

    order.stripe_data = session;
    await order.save();

    // Get the list of items in the order
    // Assuming that the order object has an item_list property
    let items;

    if (typeof order.item_list === 'string') {
      // If item_list is stored as a JSON string, parse it
      items = JSON.parse(order.item_list);
    } else {
      // If item_list is stored as an array/object
      items = order.item_list;
    }

    if (!items || !Array.isArray(items)) {
      console.error(`Invalid item list for order: ${orderId}`);
      return;
    }

    // Reduce inventory for each product in the order
    for (const item of items) {
      const productId = item.product_id;
      const quantityOrdered = item.quantity;

      const product = await db.Product.findOne({ where: { id: productId } });

      if (product) {
        product.quantity -= quantityOrdered;
        if (product.quantity < 0) {
          product.quantity = 0; // Prevent negative inventory
        }
        await product.save();
      } else {
        console.error(`Product not found: ${productId}`);
      }
    }
  } catch (error) {
    console.error(`Error handling checkout session completed: ${error.message}`);
  }
}


module.exports = { handleCheckoutSessionCompleted };