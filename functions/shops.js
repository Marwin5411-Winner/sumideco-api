const sequelize = require("../db/sequelize");

//Check if shop exists
exports.checkShop = async (shopId) => {
    try {
        const shop = await sequelize.shops.findOne({ where: { id: shopId, status: 'active' } });
        if (!shop) {
            return false;
        }
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}