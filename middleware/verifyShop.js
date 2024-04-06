const sequelize = require("../db/sequelize");

exports.verifyShop = async (req, res, next) => {
    const { shopid } = req.params;
    if (!shopid) {
        return res.status(400).send("Shop Id is required");
    }

    try {
        const shop = await sequelize.shops.findOne({ where: { id: shopid } });
        if (!shop) {
            return res.status(404).send("Shop not found");
        }
        req.shop = shop;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}