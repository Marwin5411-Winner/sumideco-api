const sequelize = require("../db/sequelize");
const mongoose = require("../db/mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const moment = require("moment");

const exp = moment().add(1, "day").unix();

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

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashedPassword", hashedPassword);

    const isMatch = await bcrypt.compare(password, shop.password);
    if (!isMatch) {
      return res.status(400).json({
        success: 0,
        error: global.HTTP_CODE.BAD_REQUEST + ": Invalid Credentials",
      });
    }

    const paxy_shop = await sequelize.shops.findOne({
      where: { ssoId: shop._id.toString() },
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
        exp,
      },
      process.env.JWT_SECRET
    );

    await mongoose.ShopCustomers.updateOne(
      { email: email },
      { panelAccessToken: { accessToken: token, expiresIn: exp } }
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
    let user = await sequelize.customers.findOne({
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
        exp,
        role: "Customer",
      },
      process.env.JWT_SECRET
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
