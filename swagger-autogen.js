const swaggerAutogen = require('swagger-autogen')();
require('dotenv').config();

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/*.js'];

const config = {
    info: {
        title: 'Paxy API Documentation',
        description: '',
    },
    host: 'localhost:3000',
    schemes: ['http', 'https'],
};

swaggerAutogen(outputFile, endpointsFiles, config);