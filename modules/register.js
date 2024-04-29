const sequelize = require("../db/sequelize");
const mongoose = require("../db/mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const moment = require("moment");

const { checkShop } = require("../functions/shops");

// POST CREATE SHOP (REGISTER)
//PANEL
exports.createShop = async (req, res) => {
  const { name, email, password, shop_title, shop_description } = req.body;
  console.log("req.body", req.body);

  if (!name || !email || !password || !shop_title || !shop_description) {
    return res.status(400).send("All fields are required");
  }

  try {
    //TODO: Add validation to user for check if user already exists in mongodb Database
    //PASS
    var tarvation_user = await mongoose.ShopCustomers.findOne({ email: email });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!tarvation_user) {
      tarvation_user = await mongoose.ShopCustomers.create({
        name,
        email,
        password: hashedPassword,
      });
    }

    const paxy_shop = await sequelize.shops.findOne({ where: { email } });

    if (paxy_shop) {
      return res
        .status(400)
        .send(global.HTTP_CODE.BAD_REQUEST + ": Shop already exists");
    }
    // console.log("createdUser", createdUser);

    await sequelize.shops
      .create({
        ssoId: tarvation_user._id.toString(),
        email,
        name,
        shop_title,
        shop_description,
      })
      .then((e) => {
        res.status(201).send(e);
      });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
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
    const user = await sequelize.customers.findOne({
      where: { email, shop_id: shopid, deleted: 0 },
    });

    if (user) {
      return res.status(400).send("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await sequelize.customers.create({
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
