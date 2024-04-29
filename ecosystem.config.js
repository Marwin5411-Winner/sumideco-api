require("dotenv").config();

module.exports = {
  apps: [
    {
      name: "Paxy-API",
      script: "./bin/www",
      instances: 1,
      autorestart: true,
      max_memory_restart: "1G",
      watch: ".",
      ignore_watch: ["node_modules", "public", "logs"],
      env: {
        NODE_ENV: "development",
        MYSQL_DATABASE_URL: process.env.MYSQL_DATABASE_URL,
        POSTGRES_DATABASE_URL: process.env.POSTGRES_DATABASE_URL,

        JWT_SECRET: process.env.JWT_SECRET,
        MONGO_DATABASE_URL: process.env.MONGO_DATABASE_URL,
      },
      // ^env_\S*$ => Specify environment variables to be injected when using –env
      env_production: {
        MYSQL_DATABASE_URL: process.env.MYSQL_DATABASE_URL,
        POSTGRES_DATABASE_URL: process.env.POSTGRES_DATABASE_URL,

        JWT_SECRET: process.env.JWT_SECRET,
        MONGO_DATABASE_URL: process.env.MONGO_DATABASE_URL,
        PORT: 9000,
        HOST: "dev.hewkhao.com/paxy-api",
      },
    },
  ],

  deploy: {
    production: {
      // SSH user
      user: "marwin",
      // SSH host
      host: "141.98.17.209",
      // GIT remote/branch
      ref: "origin/main",
      // GIT remote
      repo: "git@github.com:tarvation/paxy-api.git",
      // Fetch all branches or fast
      fetch: "all",
      // Path in the server
      path: "/home/marwin/paxy-api",
      // Command run after pull source code
      'post-deploy' : "npm install && pm2 reload ecosystem.config.js --env production && npm run generate-swagger && pm2 save",
    },
  },
};
