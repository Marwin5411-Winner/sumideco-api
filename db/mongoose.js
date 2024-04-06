const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_DATABASE_URL);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
  console.log("MongoDb Connection Successful!");
});

const ShopCustomers = mongoose.model(
  "ShopCustomers",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: Object,
      default: {
        paxy: {
          active: false,
          startDate: null,
          endDate: null,
        },
      },
    },
    panelAccessToken: {
      type: Object,
      default: {
        accessToken: null,
        refreshToken: null,
        expiresIn: null,
      }
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  }),
  "customers"
);

module.exports = { ShopCustomers };
