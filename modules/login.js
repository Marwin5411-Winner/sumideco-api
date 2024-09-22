const db = require("../models");
const mongoose = require("../db/mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const moment = require("moment");

//POST LOGIN SHOP PANEL
exports.loginShop = async (req, res) => {
  const { email, password } = req.body;
  try {
    let shop = await mongoose.ShopCustomers.findOne({
      email: email,
    });

    if (!shop) {
      return res.status(404).json({
        success: 0,
        error: global.HTTP_CODE.NOT_FOUND + ": Shop not found",
      });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    // console.log("hashedPassword", hashedPassword);

    const isMatch = await bcrypt.compare(password, shop.password);
    if (!isMatch) {
      return res.status(400).json({
        success: 0,
        error: global.HTTP_CODE.BAD_REQUEST + ": Invalid Credentials",
      });
    }

    const paxy_shop = await db.Shop.findOne({
      where: { ssoId: shop._id.toString() },
      include: [db.ShopDetail]
    });

    if (!paxy_shop) {
      return res.status(404).json({
        success: 0,
        error: global.HTTP_CODE.NOT_FOUND + ": Shop not found",
      });
    }

    const token = jwt.sign(
      {
        id: paxy_shop.id,
        ssoid: shop._id.toString(),
        email: shop.email,
        role: "Shop",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    await mongoose.ShopCustomers.updateOne(
      { email: email },
      { panelAccessToken: { accessToken: token, expiresIn: moment().add(1, 'd') } }
    );

    return res.status(200).send({
      success: 1,
      error: null,
      data: {
        shop: paxy_shop,
        token,
        user: shop,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: 0,
      error: error.message,
    });
  }
};

exports.loginCustomer = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: 0,
      error: global.HTTP_CODE.BAD_REQUEST + ": Email and Password are required",
    });
  }

  try {
    let user = await db.Customer.findOne({
      where: { email, deleted: 0 },
    });
    if (!user) {
      return res.status(401).json({
        success: 0,
        error: global.HTTP_CODE.UNAUTHORIZED + ": User not found",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: 0,
        error: global.HTTP_CODE.BAD_REQUEST + ": Invalid Credentials",
      });
    }
    // Generate token
    //Expires in 12 hours
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        shop_id: user.shop_id,
        role: "Customer",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    user.password = undefined;
    return res.status(200).json({
      success: 1,
      error: null,
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};
