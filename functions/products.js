const sequelize = require("../db/sequelize");

// Check Product Quanity
exports.checkProductQuantity = async (product_id, quantity) => {
    try {
        const product = await sequelize.products.findOne({
            where: {
                id: product_id,
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