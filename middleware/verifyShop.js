const db = require("../models");

exports.verifyShop = async (req, res, next) => {
    const { shopid } = req.params;
    if (!shopid) {
        return res.status(400).send("Shop Id is required");
    }

    try {
        const shop = await db.Shop.findOne({ where: { id: shopid, status: 'active' } });
        if (!shop) {
            return res.status(404).send("Shop not found or Shop is not active or suspended");
        }
        req.shop = shop;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}