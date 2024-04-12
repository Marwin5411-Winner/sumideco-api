module.exports = {
    Query: {
        max_limit: 100,
    },
    server: {
        host : process.env.HOST || 'localhost:3000',
        port : process.env.PORT || 3000,
    }

}