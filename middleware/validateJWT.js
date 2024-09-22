const db = require("../models");
const jwt = require("jsonwebtoken");
const moment = require("moment");

exports.validateJWT = async (req, res, next) => {
  const token = req.headers["authorization"];

  try {
    if (token) {
      // Ensure the token starts with 'Bearer '
      if (!token.startsWith("Bearer ")) {
        return res
          .status(401)
          .send(global.HTTP_CODE.UNAUTHORIZED + " :Token is invalid");
      }

      const jwtToken = token.split(" ")[1];
      let decoded;

      // Verify the token
      try {
        decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
      } catch (err) {
        return res
          .status(401)
          .send(global.HTTP_CODE.UNAUTHORIZED + ": Token is invalid");
      }

      // Check if token has expired
      if (decoded.exp < moment().unix()) {
        return res
          .status(401)
          .send(global.HTTP_CODE.UNAUTHORIZED + ": Token has expired");
      }

      // Fetch the user or shop based on the role in the token
      if (decoded.role === "Customer") {
        const user = await db.Customer.findOne({
          where: { id: decoded.id, email: decoded.email },
        });

        if (!user) {
          return res
            .status(404)
            .send(global.HTTP_CODE.NOT_FOUND + ": User not found");
        }

        req.user = user;
      } else if (decoded.role === "Shop") {
        const shop = await db.Shop.findOne({
          where: { id: decoded.id, ssoId: decoded.ssoid },
        });

        if (!shop) {
          return res
            .status(404)
            .send(global.HTTP_CODE.NOT_FOUND + ": Shop not found");
        }

        req.shop = shop;
      }
    } else {
      // No token provided; proceed as an anonymous customer
      req.user = null;
      req.shop = null;
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).send(global.HTTP_CODE.INTERNAL_SERVER_ERROR + ": " + error.message);
  }
};
