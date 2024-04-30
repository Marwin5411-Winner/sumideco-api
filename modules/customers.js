const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("../db/sequelize");
const config = require("../config");

exports.getCustomersByShopId = async (req, res) => {
  const { shopid } = req.params;

  if (shopid == "undefined" || shopid == null || shopid == "") {
    return res.status(400).json({
      success: 0,
      error: global.HTTP_CODE.BAD_REQUEST + ": Shop ID is required",
    });
  }

  if (req.shop?.id !== shopid) {
    return res.status(403).json({
      success: 0,
      error: global.HTTP_CODE.FORBIDDEN + ": You are not authorized to view this shop's customers",
    });
  }

  try {
    const users = await sequelize.customers.findAll({
      attributes: { exclude: ["password"] },
      where: { shop_id: shopid, deleted: 0 },
      limit: req.query.limit ? parseInt(req.query.limit) : config.Query.limit,
      offset: req.query.offset ? parseInt(req.query.offset) : 0,
    });

    return res.status(200).json({
      success: 1,
      error: null,
      data: users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: 0,
      error: error.message,
    });
  }
};

exports.getCustomerById = async (req, res) => {
  const { id, shopid } = req.params;

  if (id == "undefined" || id == null || id == "") {
    return res.status(400).json({
      success: 0,
      error: global.HTTP_CODE.BAD_REQUEST + ": User ID is required",
    });
  }

  //Check if user is authorized to view this shop's customer
  if (req.shop?.id !== shopid || req.user?.id !== id) {
    return res.status(403).json({
      success: 0,
      error: global.HTTP_CODE.FORBIDDEN + ": You are not authorized to view this shop's customer",
    });
  }

  try {
    const user = await sequelize.customers.findOne({
      attributes: { exclude: ["password"] },
      where: { id, shop_id: shopid, deleted: 0 },
    });
    if (!user) {
      return res.status(404).json({
        success: 0,
        error: "User not found",
      });
    }

    return res.status(200).json({
      success: 1,
      error: null,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: 0,
      error: error.message,
    });
  }
};



exports.updateCustomer = async (req, res) => {
  const { id, shopid } = req.params;
  const { name, email, password, address, phone } = req.body;

  if (id == "undefined" || id == null || id == "") {
    return res.status(400).json({
      success: 0,
      error: global.HTTP_CODE.BAD_REQUEST + ": User ID is required",
    });
  }

  //Check if user is authorized to update this shop's customer
  if (req.shop?.id !== shopid || req.user?.id !== id) {
    return res.status(403).json({
      success: 0,
      error: global.HTTP_CODE.FORBIDDEN + ": You are not authorized to update this shop's customer",
    });
  }

  try {
    const user = await sequelize.customers.findOne({
      where: { id, shop_id: shopid, deleted: 0},
    });
    if (!user) {
      return res.status(404).json({
        success: 0,
        error: global.HTTP_CODE.NOT_FOUND + ": User not found",
      });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;
   

    await user.update({ name: name || user.name, email: email || user.email , password: hashedPassword || user.password });

    return res.status(200).json({
      success: 1,
      error: null,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: 0,
      error: error.message,
    });
  }
};

exports.deleteCustomer = async (req, res) => {
  const { id, shopid } = req.params;

  if (id == "undefined" || id == null || id == "") {
    return res.status(400).json({
      success: 0,
      error: global.HTTP_CODE.BAD_REQUEST + ": User ID is required",
    });
  }

  //Check if user is authorized to delete this shop's customer
  if (req.shop?.id !== shopid || req.user?.id !== id) {
    return res.status(403).json({
      success: 0,
      error: global.HTTP_CODE.FORBIDDEN + ": You are not authorized to delete this shop's customer",
    });
  }

  try {
    const user = await sequelize.customers.update({
        deleted: 1,
        }, {
        where: { id, shop_id: shopid, deleted: 0 },
    })


    //Check if user not exists
    if (!user) {
      return res.status(404).json({
        success: 0,
        error: global.HTTP_CODE.NOT_FOUND + ": User not found",
      });
    }

    return res.status(200).json({
      success: 1,
      error: null,
      data: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: 0,
      error: error.message,
    });
  }
};

