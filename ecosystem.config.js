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
        MYSQL_DATABASE_URL: "mysql://dev:!Home4301@141.98.17.209:3306/paxy",
        JWT_SECRET:
          "2730ef7c55e044d48d52764f66e12ac066b2114a52d9fc06b05325afb74a0d9d9ed46a657dc7341954d4ebe4d0f8a5fe1dc6a2ff48c602ddef243ae97e0c7b1a07f045bc027376da64e00e3a91c339fc625a21f19d393805eb9aa1c5dfbf680b3b450952e951a619ea0a97a6160ca40e9dd5734bbb79ba2a5c109dd2e2b385c5dbdf5c9b45a064a33c2b7fa8dcca1d354ad8164320cf856095f62a8b3449929aedf7fb7526548e07043722bb775cab8b4e45e53cbc7e0b976afc0aacef8dbb463d3560ea46c49374dfef858971c07558bb1e6919d57170c850d875ad4592bbf1fff560bec0089e32dc9dac63847087378d33108cc7d1fadf5888c43482717646",
        MONGO_DATABASE_URL:
          "mongodb+srv://paxy:!Home4301@ap-se-1.kivqnnv.mongodb.net/tarvation_customers?retryWrites=true&w=majority&appName=ap-se-1",
      },
      // ^env_\S*$ => Specify environment variables to be injected when using –env
      env_production: {
        MYSQL_DATABASE_URL: "mysql://dev:!Home4301@141.98.17.209:3306/paxy",
        JWT_SECRET:
          "2730ef7c55e044d48d52764f66e12ac066b2114a52d9fc06b05325afb74a0d9d9ed46a657dc7341954d4ebe4d0f8a5fe1dc6a2ff48c602ddef243ae97e0c7b1a07f045bc027376da64e00e3a91c339fc625a21f19d393805eb9aa1c5dfbf680b3b450952e951a619ea0a97a6160ca40e9dd5734bbb79ba2a5c109dd2e2b385c5dbdf5c9b45a064a33c2b7fa8dcca1d354ad8164320cf856095f62a8b3449929aedf7fb7526548e07043722bb775cab8b4e45e53cbc7e0b976afc0aacef8dbb463d3560ea46c49374dfef858971c07558bb1e6919d57170c850d875ad4592bbf1fff560bec0089e32dc9dac63847087378d33108cc7d1fadf5888c43482717646",
        MONGO_DATABASE_URL:
          "mongodb+srv://paxy:!Home4301@ap-se-1.kivqnnv.mongodb.net/tarvation_customers?retryWrites=true&w=majority&appName=ap-se-1",
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
