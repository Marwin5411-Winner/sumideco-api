const db = require("../models");

exports.getAccountIdByShopId = async (req, res) => {
  if (!req.shop.id) {
    return res.status(400).json({
      error: "Shop Logged In nned : ShopId is required",
    });
  }

  try {
    const shop_secrets = await db.ShopSecret.findOne({
      where: { shop_id: req.shop.id },
    });

    if (!shop_secrets) {
        throw new Error(`ShopSecret not found for shopId: ${shopId}`);
      }

    
    return res.status(200).json({
        success: 1,
        error: null,
        data: shop_secrets,
    });
  } catch (error) {}
};


