const sequelize = require("../db/sequelize");
const jwt = require("jsonwebtoken");
const moment = require("moment");

exports.validateJWT = async (req, res, next) => {
  const token = req.headers["authorization"];

  //Check if Request method is GET
  if (req.method === "GET" && !token) {
    return next();
  }

  if (!token) {
    return res
      .status(401)
      .send(global.HTTP_CODE.UNAUTHORIZED + ": Token is required");
  }

  try {
    if (!token.startsWith("Bearer ")) {
      return res
        .status(401)
        .send(global.HTTP_CODE.UNAUTHORIZED + " :Token is invalid");
    }

    const jwtToken = token.split(" ")[1];
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);

    if (!decoded) {
      return res
        .status(401)
        .send(global.HTTP_CODE.UNAUTHORIZED + ": Token is invalid");
    }

    //Check if token has expired
    if (decoded.exp < moment().unix()) {
      return res
        .status(401)
        .send(global.HTTP_CODE.UNAUTHORIZED + ": Token has expired");
    }

    if (decoded.role === "Customer") {
      const user = await sequelize.customers.findOne({
        where: { id: decoded.id, email: decoded.email },
      });

      if (!user) {
        return res
          .status(404)
          .send(global.HTTP_CODE.NOT_FOUND + ": User not found");
      }

      req.user = user;
    } else if (decoded.role === "Shop") {
      console.log(decoded);
      const shop = await sequelize.shops.findOne({
        where: { id: decoded.id, ssoId: decoded.ssoid },
      });

      req.shop = shop;
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};
