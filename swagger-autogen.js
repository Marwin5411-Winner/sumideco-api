

const swaggerAutogen = require('swagger-autogen')();
const SERVER_CONFIG = require('./config');

//Get args from command line
const args = process.argv.slice(2);
let host;

if (args[0] === 'prod') {
    host = 'dev.hewkhao.com/paxy-api';
} else {
    host = SERVER_CONFIG.server.host;
}

const outputFile = './swagger.json';
const endpointsFiles = ['./app.js'];

const config = {
    info: {
        title: 'Paxy API Documentation',
        description: '',
    },
    host: host,
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            name: 'Shops',
            description: 'APIs for Shops'
        },
        {
            name: 'Customers',
            description: 'APIs for Customers'
        },
        {
            name: 'Products',
            description: 'APIs for Products'
        },
        {
            name: 'Orders',
            description: 'APIs for Orders'
        },
    ],
    securityDefinitions: {
        apiKeyAuth: {
          type: 'token',
          in: 'header', // can be 'header', 'query' or 'cookie'
          name: 'authorization', // name of the header, query parameter or cookie
          description: 'Any value can be used as token'
        }
      }
};

swaggerAutogen(outputFile, endpointsFiles, config);