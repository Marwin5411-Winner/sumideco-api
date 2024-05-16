const sequelize = require("../db/sequelize");
const moment = require("moment");
const { checkProductByIdwithShopId, checkProductQuantity, getProductById } = require("../functions/products");


exports.getOrdersByShopId = async (req, res) => {
    const { shopid } = req.params;

    if (req.shop?.id != shopid) {
        return res.status(403).json({
            sucess: 0,
            error: global.HTTP_CODE.FORBIDDEN + ": You are not allowed to view orders for this shop",
        })
    }

    try {
        const orders = await sequelize.orders.findAll({
            where: {
                shop_id: shopid,
                deleted: 0,
            },
        });

        if (!orders) {
            return res.status(404).json({
                success: 0,
                error: global.HTTP_CODE.NOT_FOUND + ": No Orders in Your Shop",
            });
        }

        return res.status(200).json({
            success: 1,
            error: null,
            data: orders,
        
        });
    } catch (error) {
        return res.status(500).json({
            success: 0,
            error: error.message,
        });
    }
}

exports.getOrderById = async (req, res) => {
    try {
        const shopId = req.params.shopid;

        const orderId = req.params.id;
        let order = await sequelize.orders.findOne({
            where: {
                id: orderId,
                shop_id: shopId,
                deleted: 0,
            },
        });

        if (!order) {
            return res.status(404).json({
                success: 0,
                error: global.HTTP_CODE.NOT_FOUND + ": Order not found",
            });
        }

        // Get Product Details
        order.item_list = JSON.parse(order.item_list);
        for (let i = 0; i < order.item_list.length; i++) {
            const product = await getProductById(shopId,  order.item_list[i].product_id);
            order.item_list[i].product = product.get();
        }


        return res.status(200).json({
            success: 1,
            error: null,
            data: order,
        
        });
    } catch (error) {
        return res.status(500).json({
            success: 0,
            error: error.message,
        });
    }
}

exports.createOrder = async (req, res) => {
    const { shopid } = req.params;
    const { customer_id, address, status, discount } = req.body;
    
    // Optional: Access products and payment data from nested structure (if applicable)
    

    const customer = await sequelize.customers.findOne({
        where : {
            id: customer_id
        }
    })

    if (!customer) {
        return res.status(404).json({
            success: 0,
            error: "Customer Not Found or Missing Cart",
          });
    }

    const { products, payment } = customer.cart // Access from "data" if present, otherwise from top-level

    
    try {
      // Check if product is available
      for (const product of products) {
        const { id, amount } = product; // Assuming "amount" instead of "quantity"
        const productExist = await checkProductByIdwithShopId(shopid, id);
        const productQuantity = await checkProductQuantity(id, amount, shopid);
        if (!productExist) {
          return res.status(404).json({
            success: 0,
            error: global.HTTP_CODE.NOT_FOUND + ": Product not found \n Product ID : " + id,
          });
        }
        if (!productQuantity) {
          return res.status(400).json({
            success: 0,
            error: global.HTTP_CODE.BAD_REQUEST + ": Product quantity not available \n Product ID : " + id,
          });
        }
      }
        // Create Order
        const order = await sequelize.orders.create({
            customer_id,
            item_list: products,
            subtotal: payment.total,
            address,
            status,
            order_date: moment().utc().format("YYYY-MM-DD HH:mm:ss"),
            total: payment.total + payment.tax,
            shop_id: shopid,
        });

        return res.status(201).json({
            success: 1,
            error: null,
            data: order,
        
        });
    } catch (error) {
        return res.status(500).json({
            success: 0,
            error: error.message,
        });
    }
}

exports.updateOrder = async (req, res) => {
    try {
        const shopId = req.params.shopid;
        const orderId = req.params.id;
        const { status, customer_id, subtotal, address, total } = req.body;

        const order = await sequelize.orders.findOne({
            where: {
                id: orderId,
                shop_id: shopId,
                deleted: 0,
            },
        });

        if (!order) {
            return res.status(404).json({
                success: 0,
                error: global.HTTP_CODE.NOT_FOUND + ": Order not found",
            });
        }

        await order.update({
            customer_id: customer_id ? customer_id : order.customer_id,
            item_list: item_list ? item_list : order.item_list,
            subtotal: subtotal ? subtotal : order.subtotal,
            address: address ? address : order.address,
            status: status ? status : order.status,
            total: total ? total : order.total,
            shop_id: shopId,
        });

        return res.status(200).json({
            success: 1,
            error: null,
            data: order,
        });
    } catch (error) {
        return res.status(500).json({
            success: 0,
            error: error.message,
        });
    }
}

exports.deleteOrder = async (req, res) => {
    try {
        const shopId = req.params.shopid;
        const orderId = req.params.id;

        const order = await sequelize.orders.findOne({
            where: {
                id: orderId,
                shop_id: shopId,
                deleted: 0,
            },
        });

        if (!order) {
            return res.status(404).json({
                success: 0,
                error: global.HTTP_CODE.NOT_FOUND + ": Order not found",
            });
        }

        await order.update({
            deleted: 1,
        });

        return res.status(201).json({
            success: 1,
            error: null,
            data: order,
        });
    } catch (error) {
        return res.status(500).json({
            success: 0,
            error: error.message,
        });
    }
}