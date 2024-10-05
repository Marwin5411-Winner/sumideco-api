var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
var cors = require("cors");
const bodyParser = require("body-parser");

var indexRouter = require("./routes/index");
var shopsRouter = require("./routes/shops");
const customersRouter = require("./routes/customers");
const productsRouter = require("./routes/products");
const ordersRouter = require("./routes/orders");
const productCategoriesRouter = require("./routes/productCategories");
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
const systemsRouter = require("./routes/systems");
const checkoutRouter = require("./routes/checkout");
const storefrontRouter = require('./routes/storefront');

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

//Database connection
require("./db/sequelize");
require("./db/mongoose");

global.HTTP_CODE = require("./HTTP_CODE");

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4000",
  "http://localhost:3001",
  "3.18.12.63",
  "3.130.192.231",
  "13.235.14.237",
  "13.235.122.149",
  "18.211.135.69",
  "35.154.171.200",
  "52.15.183.38",
  "54.88.130.119",
  "54.88.130.237",
  "54.187.174.169",
  "54.187.205.235",
  "54.187.216.72",
];

const isAllowedSubdomain = (origin) => {
  if (!origin) return false; // Handle cases where origin is undefined
  try {
    const url = new URL(origin);
    const hostname = url.hostname;
    return hostname === "sumideco.com" || hostname.endsWith(".sumideco.com");
  } catch (err) {
    // If the origin is not a valid URL, block it
    return false;
  }
};

// CORS options delegate function
const corsOptionsDelegate = function (req, callback) {
  const origin = req.header('Origin');

  if (req.path.startsWith('/webhook/')) {
    // Bypass CORS for any requests to /webhook/*
    callback(null, { origin: true }); // Allow all origins
  } else {
    // Apply your existing CORS restrictions
    console.log(origin)
    if (allowedOrigins.includes(origin) || isAllowedSubdomain(origin)) {
      callback(null, { origin: true }); // Allow the origin
    } else {
      callback(new Error('Not allowed by CORS'), { origin: false }); // Block the origin
    }
  }
};

//Custom Middleware
const { validateJWT } = require("./middleware/validateJWT");

const app = express();

app.use(cors(corsOptionsDelegate));
app.use(logger("dev"));
// Apply express.json() globally except for the /webhook/stripe route
app.use((req, res, next) => {
  if (req.originalUrl === "/webhook/stripe") {
    next(); // Skip JSON body parsing for Stripe webhook
  } else {
    express.json()(req, res, next); // Apply express.json() to all other routes
  }
});
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/shops", validateJWT, shopsRouter);
app.use("/customers", validateJWT, customersRouter);
app.use("/products", validateJWT, productsRouter);
app.use("/orders", validateJWT, ordersRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/productCategories", validateJWT, productCategoriesRouter);
app.use("/systems", systemsRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/checkout", checkoutRouter);
app.use("/storefront", validateJWT, storefrontRouter);

const webhook = require("./modules/webhook");
app.post(
  "/webhook/stripe",
  bodyParser.raw({ type: "application/json" }),
  async (req, res, next) => {
    try {
      // Call your webhook handler function
      await webhook.StripeWebhook(req, res);
    } catch (err) {
      next(err); // Pass any errors to Express error handling middleware
    }
  }
);

module.exports = app;
