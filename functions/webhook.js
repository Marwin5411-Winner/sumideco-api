const db = require('../models');


async function handleCheckoutSessionCompleted(session) {
    const orderId = session.metadata.order_id;
  
    // Fetch the order from your database
    const order = await db.Order.findOne({ where: { id: orderId } });
  
    if (!order) {
      console.error(`Order not found: ${orderId}`);
      return;
    }
  
    // Update order status to 'paid'
    order.status = 'paid';
    await order.save();
  
    // Reduce inventory for each product in the order
    const products = JSON.parse(order.item_list); // Assuming item_list is a JSON string
  
    for (const item of products) {
      const product = await db.Product.findOne({ where: { id: item.product_id } });
  
      if (product) {
        product.quantity -= item.quantity;
        if (product.quantity < 0) {
          product.quantity = 0; // Prevent negative inventory
        }
        await product.save();
      } else {
        console.error(`Product not found: ${item.product_id}`);
      }
    }
}


module.exports = { handleCheckoutSessionCompleted };