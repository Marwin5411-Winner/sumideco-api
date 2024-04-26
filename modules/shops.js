const sequelize = require("../db/sequelize");
const mongoose = require("../db/mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const moment = require("moment");

// GET ALL USERS
//ADMIN ACCESS
//SHOP ACCESS
exports.getShops = async (req, res) => {
  if (req.admin?.role !== "Admin") {
    return res.status(403).send(global.HTTP_CODE.FORBIDDEN);
  }

  try {
    const shops = await sequelize.shops.findAll();
    res.status(200).send(shops);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

// GET Shop BY ID
exports.getShopById = async (req, res) => {
  const { id } = req.params;

  if (id == "undefined" || id == null || id == "") {
    return res.status(400).send("Shop ID is required");
  }

  try {
    const shop = await sequelize.shops.findOne({ where: { id } });
    if (!shop) {
      return res.status(404).send("Shop not found");
    }
    res.status(200).send(shop);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

// PUT UPDATE SHOP
//ADMIN ACCESS
exports.updateShop = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, shop_title, shop_description } = req.body;

  if (id == "undefined" || id == null || id == "") {
    return res.status(400).send("Shop ID is required");
  }

  //Check if user is authorized to update this shop
  if (req.shop?.id !== id || req.admin?.role !== "Admin") {
    return res
      .status(403)
      .send(
        global.HTTP_CODE.FORBIDDEN +
          ": You are not authorized to update this shop"
      );
  }

  try {
    const shop = await sequelize.shops.findOne({ where: { id } });
    if (!shop) {
      return res.status(404).send(global.HTTP_CODE.NOT_FOUND + ": Shop not found");
    }

    const updatedShop = await sequelize.shops.update(
      { name, email, password, shop_title, shop_description },
      { where: { id } }
    );
    res.status(200).send(updatedShop);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

// DELETE SHOP
//ADMIN ACCESS
exports.deleteShop = async (req, res) => {
  const { id } = req.params;

  if (req.admin?.role !== "Admin") {
    return res.status(403).send(global.HTTP_CODE.FORBIDDEN);
  }

  if (id == "undefined" || id == null || id == "") {
    return res.status(400).send("Shop ID is required");
  }
  

  try {
    const shop = await sequelize.shops.findOne({ where: { id } });
    if (!shop) {
      return res.status(404).send("Shop not found");
    }

    const deletedShop = await sequelize.shops.update(
      { deleted: 1 },
      { where: { id } }
    );

    if (!deletedShop) {
      return res.status(404).send("Shop not found");
    }

    res.status(200).send(deletedShop);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};
