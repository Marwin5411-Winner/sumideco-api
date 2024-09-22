var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
var cors = require("cors");
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

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

//Database connection
require("./db/sequelize");
require("./db/mongoose");

global.HTTP_CODE = require("./HTTP_CODE");

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://dev.hewkhao.com",
  "https://hewkhao.com",
];

const isAllowedSubdomain = (origin) => {
    if (!origin) return false; // Handle cases where origin is undefined
    try {
      const url = new URL(origin);
      const hostname = url.hostname;
      return (
        hostname === 'sumideco.com' || hostname.endsWith('.sumideco.com')
      );
    } catch (err) {
      // If the origin is not a valid URL, block it
      return false;
    }
  };
  
  const corsOptions = {
    origin: (origin, callback) => {
      if (
        allowedOrigins.includes(origin) ||
        isAllowedSubdomain(origin)
      ) {
        callback(null, true); // Allow the origin
      } else {
        callback(new Error('Not allowed by CORS')); // Block the origin
      }
    },
    optionsSuccessStatus: 200,
  };
  

//Custom Middleware
const { validateJWT } = require("./middleware/validateJWT");

const app = express();

app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(express.json());
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

module.exports = app;
