var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
var cors = require('cors')
var indexRouter = require('./routes/index');
var shopsRouter = require('./routes/shops');
const customersRouter = require('./routes/customers');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const productCategoriesRouter = require('./routes/productCategories');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const systemsRouter = require('./routes/systems');



const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');


//Database connection
require('./db/sequelize');
require('./db/mongoose');

global.HTTP_CODE = require('./HTTP_CODE');

var corsOptions = {
    origin: ['http://localhost:3000', 'https://dev.hewkhao.com', 'https://hewkhao.com'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

//Custom Middleware
const { validateJWT } = require('./middleware/validateJWT');

const app = express();

app.use(cors(corsOptions))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/shops', validateJWT, shopsRouter); 
app.use('/customers', validateJWT, customersRouter);
app.use('/products', validateJWT, productsRouter);
app.use('/orders', validateJWT, ordersRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/productCategories', validateJWT, productCategoriesRouter);
app.use('/systems', systemsRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
