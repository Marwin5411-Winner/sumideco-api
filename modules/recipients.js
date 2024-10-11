const db = require("../models");
const omise = require("../functions/paymentGateway/omise");
const { where } = require("sequelize");

exports.getRecipientByShopId = async (req, res) => {
  const shopId = req.params.shopid;

  if (!shopId) {
    return res.status(400).json({
      success: 0,
      error: "400: Shop ID is required",
    });
  }

  try {
    const shop = await db.Shop.findOne({
      where: { id: shopId },
    });

    if (!shop) {
      return res.status(404).json({
        success: 0,
        error: "404: Shop is not found",
      });
    }

    const recipient = await omise.getRecipientById(shop.id);

    return res.status(201).json({
      success: 1,
      error: null,
      data: recipient,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: 0,
      error: error.message,
    });
  }
};

exports.createRecipientByShopId = async (req, res) => {

  const { bankAcc, shop_id } = req.body;

  if (!shop_id) {
    return res.status(400).json({
      success: 0,
      error: "400: Shop ID is required",
    });
  }

  if (!bankAcc) {
    return res.status(400).json({
      success: 0,
      error: "400: BankAcc (Object) is required",
    });
  }

  try {
    const shop = await db.Shop.findOne({
      where: { id: shop_id },
    });

    if (!shop) {
      return res.status(404).json({
        success: 0,
        error: "404: Shop is not found",
      });
    }

    const recipient = await omise.createRecipient(shop.id, bankAcc);

    return res.status(201).json({
      success: 1,
      error: null,
      data: recipient,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: 0,
      error: error.message,
    });
  }
};
