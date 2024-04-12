const swaggerAutogen = require('swagger-autogen')();
const SERVER_CONFIG = require('./config');

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/*.js'];

const config = {
    info: {
        title: 'Paxy API Documentation',
        description: '',
    },
    host: SERVER_CONFIG.server.host,
    schemes: ['http', 'https'],
};

swaggerAutogen(outputFile, endpointsFiles, config);