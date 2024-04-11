const sequelize = require("../db/sequelize");

// Check Product Quanity
exports.checkProductQuantity = async (product_id, quantity, shopId) => {
    try {
        const product = await sequelize.products.findOne({
            where: {
                id: product_id,
                shop_id: shopId,
                deleted: 0
            },
        });

        if (product.quantity < quantity) {
            return false;
        }

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

exports.checkProductByIdwithShopId = async (shopId, productId) => {
    try {
        const product = await sequelize.products.findOne({
            where: {
                id: productId,
                shop_id: shopId,
                deleted: 0
            },
        });

        if (!product) {
            return false;
        }

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

// GET Products Details By Product ID with Shop ID
exports.getProductById = async (shopId, productId) => {
    try {
        const product = await sequelize.products.findOne({
            attributes: { exclude: ["deleted", "quantity", "createdAt", "updatedAt"] },
            where: {
                id: productId,
                shop_id: shopId,
                deleted: 0
            },
        });

        if (!product) {
            return false;
        }

        return product;
    } catch (error) {
        console.error(error);
        return false;
    }
}