const db = require("../models");

//Check if shop exists
exports.checkShop = async (shopId) => {
    try {
        const shop = await db.Shop.findOne({ where: { id: shopId, status: 'active' } });
        if (!shop) {
            return false;
        }
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}