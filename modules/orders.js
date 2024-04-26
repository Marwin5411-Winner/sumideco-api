const sequelize = require("../db/sequelize");
const moment = require("moment");
const { checkProductByIdwithShopId, checkProductQuantity, getProductById } = require("../functions/products");


exports.getOrdersByShopId = async (req, res) => {
    const shopId = req.params.shopid;

    if (req.shop?.id != shopId) {
        return res.status(403).send(global.HTTP_CODE.FORBIDDEN + ": You are not authorized to view this shop's orders")
    }

    try {
        
        const status = req.query.status ? req.query.status : null;
        const orders = await sequelize.orders.findAll({
            where: {
                shop_id: shopId,
                status: status,
                deleted: 0,
            },
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
            return res.status(404).json({ error: "Order not found" });
        }

        // Get Product Details
        order.item_list = JSON.parse(order.item_list);
        for (let i = 0; i < order.item_list.length; i++) {
            const product = await getProductById(shopId,  order.item_list[i].product_id);
            order.item_list[i].product = product.get();
        }


        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.createOrder = async (req, res) => {
    try {
        const shopId = req.params.shopid;
        const { customer_id, item_list, subtotal, total, address, status, discount } = req.body;

        // Check if product is available
        for (let i = 0; i < item_list.length; i++) {
            const { product_id, quantity } = item_list[i];
            const product = await checkProductByIdwithShopId(shopId, product_id);
            const productQuantity = await checkProductQuantity(product_id, quantity, shopId);
            if (!product) {
                return res.status(404).json({ error: "Product not found" });
            }
            if (!productQuantity) {
                return res.status(400).json({ error: "Product quantity is not available \n Product ID : " + product_id });
            }
        }

        // Create Order
        const order = await sequelize.orders.create({
            customer_id,
            item_list,
            subtotal,
            address,
            status,
            order_date: moment().format("YYYY-MM-DD HH:mm:ss"),
            total,
            shop_id: shopId,
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
            return res.status(404).json({ error: "Order not found" });
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

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
            return res.status(404).json({ error: "Order not found" });
        }

        await order.update({
            deleted: 1,
        });

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}