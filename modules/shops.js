const db = require("../models");
const mongoose = require("../db/mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const moment = require("moment");

// GET ALL USERS
//ADMIN ACCESS
//SHOP ACCESS
exports.getShops = async (req, res) => {
  const {
    admin,
    query: { id, subdomain }
  } = req;

  // Check if the requester has admin privileges
  if (admin?.role !== "Admin") {
    return res.status(403).json({
      success: 0,
      error: global.HTTP_CODE.FORBIDDEN
    });
  }

  try {
    // If neither `id` nor `subdomain` are specified, fetch all shops
    if (!id && !subdomain) {
      const shops = await db.Shop.findAll();
      return res.status(200).json({
        success: 1,
        data: shops
      });
    }

    // Otherwise, build the filter condition and fetch a single shop
    const whereClause = {};
    if (id) whereClause.id = id;
    if (subdomain) whereClause.subdomain = subdomain;

    const shop = await db.Shop.findOne({
      where: whereClause,
      include: [db.ShopDetail]
    });

    if (!shop) {
      return res.status(404).json({
        success: 0,
        error: "404: Shop not found"
      });
    }

    return res.status(200).json({
      success: 1,
      data: shop
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: 0,
      error: "500: An error occurred while fetching shop data"
    });
  }
};

exports.getShopById = async (req, res) => {
  const { id } = req.params;

  // Check if 'id' is provided
  if (!id) {
    return res.status(400).json({
      success: 0,
      error: "400: 'id' parameter is required"
    });
  }

  try {
    // Fetch the shop by 'id'
    const shop = await db.Shop.findOne({
      where: { id: id },
      include: [db.ShopDetail]
    });

    if (!shop) {
      return res.status(404).json({
        success: 0,
        error: "404: Shop not found"
      });
    }

    return res.status(200).json({
      success: 1,
      data: shop
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: 0,
      error: "500: An error occurred while fetching shop data"
    });
  }
};


// PUT UPDATE SHOP
//ADMIN ACCESS
exports.updateShop = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, shop_title, shop_description } = req.body;

  if (id == "undefined" || id == null || id == "") {
    return res.status(400).json({
      success: 0,
      error: global.HTTP_CODE.BAD_REQUEST + ": Shop ID is required",
    });
  }

  //Check if user is authorized to update this shop
  if (req.shop?.id !== id || req.admin?.role !== "Admin") {
    return res.status(403).json({
      success: 0,
      error:
        global.HTTP_CODE.FORBIDDEN +
        ": You are not authorized to update this shop",
    });
  }

  try {
    const shop = await db.Shop.findOne({ where: { id } });
    if (!shop) {
      return res.status(404).json({
        success: 0,
        error: global.HTTP_CODE.NOT_FOUND + ": Shop not found",
      });
    }

    const updatedShop = await db.Shop.update(
      { name, email, password, shop_title, shop_description },
      { where: { id } }
    );
    return res.status(200).json({
      success: 1,
      error: null,
      data: updatedShop,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: 0,
      error: error.message,
    });
  }
};

// DELETE SHOP
//ADMIN ACCESS
exports.deleteShop = async (req, res) => {
  const { id } = req.params;

  if (req.admin?.role !== "Admin") {
    return res.status(403).json({
      success: 0,
      error: global.HTTP_CODE.FORBIDDEN + ": You are not authorized to delete shop",
    });
  }

  if (id == "undefined" || id == null || id == "") {
    return res.status(400).json({
      success: 0,
      error: global.HTTP_CODE.BAD_REQUEST + ": Shop ID is required",
    })
  }

  try {
    const shop = await db.Shop.findOne({ where: { id } });
    if (!shop) {
      return res.status(404).json({
        success: 0,
        error: global.HTTP_CODE.NOT_FOUND + ": Shop not found",
      });
    }

    const deletedShop = await db.Shop.update(
      { deleted: 1 },
      { where: { id } }
    );

    if (!deletedShop) {
      return res.status(404).json({
        success: 0,
        error: global.HTTP_CODE.NOT_FOUND + ": Shop not found",
      });
    }

    return res.status(200).json({
      success: 1,
      error: null,
      data: deletedShop,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: 0,
      error: error.message,
    });
  }
};
