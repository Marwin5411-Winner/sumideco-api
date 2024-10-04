const db = require("../models");
const moment = require("moment");
const { checkProductByIdwithShopId, checkProductQuantity, getProductById } = require("../functions/products");
const { where } = require("sequelize");
const shop = require("../models/shop");


exports.getOrdersByShopId = async (req, res) => {
    const { shopid } = req.params;

    if (req.shop?.id != shopid) {
        return res.status(403).json({
            sucess: 0,
            error: global.HTTP_CODE.FORBIDDEN + ": You are not allowed to view orders for this shop",
        })
    }

    try {
        const orders = await db.Order.findAll({
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
        let order = await db.Order.findOne({
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
    const { customer_id, email, address, status, coupon_id, products } = req.body;

    if (!email || !products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({
            success: 0,
            error: 'Email and products are required'
        });
    }

    const shop = db.ShopDetail.findOne({
        where: {
            shop_id: shopid
        }
    })

    let discount = 0;

    try {
        // Validate the products and their availability
        let subtotal = 0;
        const validatedProducts = [];

        for (const product of products) {
            const { id, quantity } = product; 

            // Fetch the product details
            const productData = await db.Product.findOne({
                where: {
                    id: id,
                    shop_id: shopid
                }
            });

            if (!productData) {
                return res.status(404).json({
                    success: 0,
                    error: `Product not found or invalid. Product ID: ${id}`
                });
            }

            // Check if sufficient quantity is available
            if (productData.quantity < quantity) {
                return res.status(400).json({
                    success: 0,
                    error: `Insufficient quantity for product ID: ${id}`
                });
            }

            // Calculate subtotal based on product price and quantity
            const productSubtotal = productData.price * quantity;
            subtotal += productSubtotal;

            // Append the validated product
            validatedProducts.push({
                product_id: productData.id,
                quantity,
            });
        }

        // Apply a 10% tax on subtotal and calculate the total
        const tax = subtotal;
        const total = subtotal + tax - discount;

        const platformFee = (shop.paymentFeePercentage * (total / 100));

        // Create the order
        const order = await db.Order.create({
            customer_id: customer_id || null,
            email: email,
            item_list: JSON.stringify(validatedProducts), // Store item list as JSON
            subtotal: subtotal,
            discount: discount,
            coupon_id: coupon_id || null,
            platformFee: platformFee,
            total_revenue: (total - platformFee),
            shop_id: shopid,
            address: address || null,
            order_date: new Date().toISOString(),
            status: status,
            total: total,
            deleted: 0 // Default value for active orders
        });

        // Return success response
        return res.status(201).json({
            success: 1,
            error: null,
            data: order
        });

    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({
            success: 0,
            error: error.message
        });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const shopId = req.params.shopid;
        const orderId = req.params.id;
        const { status, customer_id, subtotal, address, total } = req.body;

        const order = await db.Order.findOne({
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

        const order = await db.Order.findOne({
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