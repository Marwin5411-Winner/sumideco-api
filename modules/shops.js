const sequlize = require("../db/sequelize");
const mongoose = require("../db/mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const moment = require("moment");

// GET ALL USERS
//ADMIN ACCESS
exports.getShops = async (req, res) => {
  try {
    const shops = await sequlize.shops.findAll();
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
    const shop = await sequlize.shops.findOne({ where: { id } });
    if (!shop) {
      return res.status(404).send("Shop not found");
    }
    res.status(200).send(shop);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

// POST CREATE SHOP (REGISTER)
//PANEL
exports.createShop = async (req, res) => {
  const { name, email, password, shop_title, shop_description } = req.body;
  console.log("req.body", req.body);
  try {
    //TODO: Add validation to user for check if user already exists in mongodb Database
    //PASS 
    if (await mongoose.ShopCustomers.findOne({ email: email })) {
      return res.status(400).send("User already exists");
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdShop = await mongoose.ShopCustomers.create({ name, email, password: hashedPassword });

    // console.log("createdUser", createdUser);

    await sequlize.shops
      .create({ ssoId: createdShop._id.toString(), name, shop_title, shop_description})
      .then((e) => {
        res.status(201).send(e);
      });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

//POST LOGIN SHOP PANEL
exports.loginShop = async (req, res) => {
  const { email, password } = req.body;
  try {
    let shop = await mongoose.ShopCustomers.findOne({
      email: email,
    });

    if (!shop) {
      return res.status(404).send("User not found");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashedPassword", hashedPassword);
    
    const isMatch = await bcrypt.compare(password, shop.password);
    if (!isMatch) {
      return res.status(400).send("Invalid password");
    }

    const token = jwt.sign({ ssoid: shop._id.toString(), email: shop.email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const updatedUser = await mongoose.ShopCustomers.updateOne(
      { email: email },
      { panelAccessToken: { accessToken: token, expiresIn: moment().add('1day') } }
    );

    res.status(200).send({
      token,
      shop,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};
