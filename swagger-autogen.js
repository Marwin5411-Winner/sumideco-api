

const swaggerAutogen = require('swagger-autogen')();
const SERVER_CONFIG = require('./config');

//Get args from command line
const args = process.argv.slice(2);

if (args[0] === 'prod') {
    const host = 'dev.hewkhao.com/paxy-api';
} else {
    const host = SERVER_CONFIG.server.host;
}

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/*.js'];

const config = {
    info: {
        title: 'Paxy API Documentation',
        description: '',
    },
    host: host,
    schemes: ['http', 'https'],
};

swaggerAutogen(outputFile, endpointsFiles, config);