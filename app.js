var express = require('express')();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

var indexRouter = require('./routes/index');
var shopsRouter = require('./routes/shops');
const customersRouter = require('./routes/customers');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');


const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');


//Database connection
require('./db/sequelize');
require('./db/mongoose');


//Custom Middleware
const { verifyShop } = require('./middleware/verifyShop');

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', shopsRouter);
app.use('/', customersRouter);
app.use('/', productsRouter);
app.use('/', ordersRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
