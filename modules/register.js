const db = require("../models");
const mongoose = require("../db/mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const moment = require("moment");

const { checkShop } = require("../functions/shops");

// POST CREATE SHOP (REGISTER)
//PANEL
exports.createShop = async (req, res) => {
  const { username, email, password, shop_title, shop_description } = req.body;
  console.log("req.body", req.body);

  if (!username || !email || !password || !shop_title || !shop_description) {
    return res.status(400).json({
      success: 0,
      error:
        global.HTTP_CODE.BAD_REQUEST +
        ": All fields are required to register a user",
    });
  }

  try {
    //TODO: Add validation to user for check if user already exists in mongodb Database
    //PASS
    var tarvation_user = await mongoose.ShopCustomers.findOne({ email: email });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!tarvation_user) {
      tarvation_user = await mongoose.ShopCustomers.create({
        name: username,
        email,
        password: hashedPassword,
      });
    }

    const paxy_shop = await db.Shop.findOne({ where: { email } });

    if (paxy_shop) {
      return res.status(400).json({
        success: 0,
        error: global.HTTP_CODE.BAD_REQUEST + ": Email already exists",
      });
    }
    // console.log("createdUser", createdUser);

    const shop = await db.Shop.create({
      ssoId: tarvation_user._id.toString(),
      email,
      username,
      shop_title,
      shop_description,
    });

    const shops_details = await db.ShopDetail.create({
      shop_id: shop.id,
      title: shop_title,
      headline: shop_description,
    }).then((e) => {
      return res.status(201).json({
        success: 1,
        error: null,
        data: e,
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: 0,
      error: error.message,
    });
  }
};

// POST CREATE CUSTOMER (REGISTER)
exports.createCustomer = async (req, res) => {
  const { shopid } = req.params;
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone) {
    return res.status(400).send("All fields are required to register a user");
  }

  //Check if shop exists
  const shop = await checkShop(shopid);
  if (!shop) {
    return res.status(404).send("Shop not found");
  }

  try {
    //Check if email already exists
    const user = await db.Customer.findOne({
      where: { email, shop_id: shopid, deleted: 0 },
    });

    if (user) {
      return res.status(400).send("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await db.Sustmers.create({
      name,
      email,
      password: hashedPassword,
      phone,
      shop_id: shopid,
    });

    res.status(201).send(createdUser);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};
