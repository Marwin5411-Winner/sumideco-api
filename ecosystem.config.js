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
        MYSQL_DATABASE_URL: "mysql://dev:!Home4301@localhost:3306/paxy",
        POSTGRES_DATABASE_URL: "postgresql://dev:!Home4301@141.98.17.209:5432/paxy",

        JWT_SECRET: "2730ef7c55e044d48d52764f66e12ac066b2114a52d9fc06b05325afb74a0d9d9ed46a657dc7341954d4ebe4d0f8a5fe1dc6a2ff48c602ddef243ae97e0c7b1a07f045bc027376da64e00e3a91c339fc625a21f19d393805eb9aa1c5dfbf680b3b450952e951a619ea0a97a6160ca40e9dd5734bbb79ba2a5c109dd2e2b385c5dbdf5c9b45a064a33c2b7fa8dcca1d354ad8164320cf856095f62a8b3449929aedf7fb7526548e07043722bb775cab8b4e45e53cbc7e0b976afc0aacef8dbb463d3560ea46c49374dfef858971c07558bb1e6919d57170c850d875ad4592bbf1fff560bec0089e32dc9dac63847087378d33108cc7d1fadf5888c43482717646" ,
        MONGO_DATABASE_URL: "mongodb+srv://paxy:!Home4301@ap-se-1.kivqnnv.mongodb.net/tarvation_customers?retryWrites=true&w=majority&appName=ap-se-1",
        FIREBASE_PRIVATE_KEY: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCqiL8T01PyOjLv\npDBtNco6g9fmOj1lX3fKFM38+AYx7IyIOkqK/gn2tF6u0hWatD1UpI/YfGcBXOr6\ncccd5PAVPxErxNUjzk03T/FIiDXbJT9vbVOt65eF3tRVRQPYWiT7STwYJLDVroPY\nd0obx1fU68SrJDRnYxcnLX6P9Zlq1yInTSkh0KdQmfBz+DUIV7e8V5e0BOocvThc\npDtOwdiwct+NYxN2YQ87YN+XVJj7vBBpzvkjVl0tguujvEXEHYW0f7OYDYTWpI0w\nxXH1DXktGIxribs8/6P7v3ZTBb4l3VPVODMeB0zHuxxHgvbie+rWesEqYPKGhwpI\nDMsjqDstAgMBAAECggEAArNJIUl8oA6LXW+SY7xREDWjvs3HyJnnJfBH5bxQrswx\n2ntf0E0e/8TR5f9GH83AVd2IOJOZtvQPdXlFP6QvKAr4XOLQRDGhV+GgbrdXcPmp\nRDytMUkUfGZvos0Ft1CQGtmJRdGY6j1J8azL4943dhPoqJQZb1SqmnB2O1XWgNJS\nFnyFMSORsU+B4ljw8fVwkJRF+bBizXDSV6Kw3GWl/YP3dsQOoBmFYnk5UXT53DKD\nk2iz4Jt7do0NBWvVxjN0qBmnoGTWEwOn93ARosSq2HwVhU6amqbFzN4UmB1r66O1\nFv5uag/aiDptrPnpslzlcL19RihrvlDwvZtgiQ6FwQKBgQDvm+FKqHP63pMzToAa\ntFKlahMgwJBvpgBNVw7B93Xu6V8w+oGUjI46afPtMi3ut3ceaDTYk4HU5uSHo0eL\nwZ7nDIrFSQoygKzwfqpJZQt11ECP2EqQHNOaQdynhJGwUMr4JDS2EbIHNLUMjewI\nJa55tDzKH8D92QYd/R4LejyMwQKBgQC2MzQybpETGNxyENomkF0Ch1hfCBZuS6kN\nMtfFq0qVjhpJMIJNGwBpI+pwWJ7oosgdoJXNGt+N4ToIXT72UOJwopN+u3D7alLk\nJnjhrhczOoS6bZidVza4GYG+6Jkr+YzILzBog1r76vo+fury3PjoT9W8arkkajxk\nO5vjYtqNbQKBgAbQoC/HasUP34/uA6a+yjr6MWEVGQaT6h5JA5pwt2H8MUDrXxQi\ni0kOCmoMq1HG1hR/UkF2sJKlnopdEoPfFe3sZWYHFcsp7cFJWP6NaS4Iw21T8Yr3\nxuz0QpphIuOo6Jz2KqmjBzU9QokA4F269KNxhOkazhpqOcpQkLIy39YBAoGAVDtT\n1ETdePCzaWB1GgL/nN2pczWv+Qmte9aXfmD0ODPb3x43/yGOjQz3ozy1KmOnFFtb\nJdlYpKUNSTSimQlHxj7C5YIOd4zuCV/n3p23SA2zsuRb+9GIEJBqNTIfLf9OoHWA\ncbDYbUJyslXGlMSnpe7SpyrHsRgUF1qfdP4Mf/kCgYEAv4xLT1qZaw/jARS0oRv/\ng0lwyvKuXozO5lEgtgnScmojGCPJjcaAi3d4G+HK6kVq73P7nFg/yyRfJEwqUSkk\n3GMygeKSHpjcYRLb59QfDTNRZLfYXmZh08QgGUTgO+XVv5t/XcSr8tjL2CFGtx/b\nEAEci54m3Komz3j1tRynzu8=\n-----END PRIVATE KEY-----\n",
        FIREBASE_CLIENT_EMAIL: "firebase-adminsdk-ouoq6@paxy-7c250.iam.gserviceaccount.com",
        FIREBASE_PROJECT_ID: "paxy-7c250",
        FIREBASE_BUCKET_NAME: "paxy-7c250.appspot.com"
      },
      // ^env_\S*$ => Specify environment variables to be injected when using –env
      env_production: {
        MYSQL_DATABASE_URL: "mysql://dev:!Home4301@localhost:3306/paxy",
        POSTGRES_DATABASE_URL: "postgresql://dev:!Home4301@141.98.17.209:5432/paxy",
        FIREBASE_PRIVATE_KEY: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCqiL8T01PyOjLv\npDBtNco6g9fmOj1lX3fKFM38+AYx7IyIOkqK/gn2tF6u0hWatD1UpI/YfGcBXOr6\ncccd5PAVPxErxNUjzk03T/FIiDXbJT9vbVOt65eF3tRVRQPYWiT7STwYJLDVroPY\nd0obx1fU68SrJDRnYxcnLX6P9Zlq1yInTSkh0KdQmfBz+DUIV7e8V5e0BOocvThc\npDtOwdiwct+NYxN2YQ87YN+XVJj7vBBpzvkjVl0tguujvEXEHYW0f7OYDYTWpI0w\nxXH1DXktGIxribs8/6P7v3ZTBb4l3VPVODMeB0zHuxxHgvbie+rWesEqYPKGhwpI\nDMsjqDstAgMBAAECggEAArNJIUl8oA6LXW+SY7xREDWjvs3HyJnnJfBH5bxQrswx\n2ntf0E0e/8TR5f9GH83AVd2IOJOZtvQPdXlFP6QvKAr4XOLQRDGhV+GgbrdXcPmp\nRDytMUkUfGZvos0Ft1CQGtmJRdGY6j1J8azL4943dhPoqJQZb1SqmnB2O1XWgNJS\nFnyFMSORsU+B4ljw8fVwkJRF+bBizXDSV6Kw3GWl/YP3dsQOoBmFYnk5UXT53DKD\nk2iz4Jt7do0NBWvVxjN0qBmnoGTWEwOn93ARosSq2HwVhU6amqbFzN4UmB1r66O1\nFv5uag/aiDptrPnpslzlcL19RihrvlDwvZtgiQ6FwQKBgQDvm+FKqHP63pMzToAa\ntFKlahMgwJBvpgBNVw7B93Xu6V8w+oGUjI46afPtMi3ut3ceaDTYk4HU5uSHo0eL\nwZ7nDIrFSQoygKzwfqpJZQt11ECP2EqQHNOaQdynhJGwUMr4JDS2EbIHNLUMjewI\nJa55tDzKH8D92QYd/R4LejyMwQKBgQC2MzQybpETGNxyENomkF0Ch1hfCBZuS6kN\nMtfFq0qVjhpJMIJNGwBpI+pwWJ7oosgdoJXNGt+N4ToIXT72UOJwopN+u3D7alLk\nJnjhrhczOoS6bZidVza4GYG+6Jkr+YzILzBog1r76vo+fury3PjoT9W8arkkajxk\nO5vjYtqNbQKBgAbQoC/HasUP34/uA6a+yjr6MWEVGQaT6h5JA5pwt2H8MUDrXxQi\ni0kOCmoMq1HG1hR/UkF2sJKlnopdEoPfFe3sZWYHFcsp7cFJWP6NaS4Iw21T8Yr3\nxuz0QpphIuOo6Jz2KqmjBzU9QokA4F269KNxhOkazhpqOcpQkLIy39YBAoGAVDtT\n1ETdePCzaWB1GgL/nN2pczWv+Qmte9aXfmD0ODPb3x43/yGOjQz3ozy1KmOnFFtb\nJdlYpKUNSTSimQlHxj7C5YIOd4zuCV/n3p23SA2zsuRb+9GIEJBqNTIfLf9OoHWA\ncbDYbUJyslXGlMSnpe7SpyrHsRgUF1qfdP4Mf/kCgYEAv4xLT1qZaw/jARS0oRv/\ng0lwyvKuXozO5lEgtgnScmojGCPJjcaAi3d4G+HK6kVq73P7nFg/yyRfJEwqUSkk\n3GMygeKSHpjcYRLb59QfDTNRZLfYXmZh08QgGUTgO+XVv5t/XcSr8tjL2CFGtx/b\nEAEci54m3Komz3j1tRynzu8=\n-----END PRIVATE KEY-----\n",
        FIREBASE_CLIENT_EMAIL: "firebase-adminsdk-ouoq6@paxy-7c250.iam.gserviceaccount.com",
        FIREBASE_PROJECT_ID: "paxy-7c250",
        FIREBASE_BUCKET_NAME: "paxy-7c250.appspot.com",
        JWT_SECRET: "2730ef7c55e044d48d52764f66e12ac066b2114a52d9fc06b05325afb74a0d9d9ed46a657dc7341954d4ebe4d0f8a5fe1dc6a2ff48c602ddef243ae97e0c7b1a07f045bc027376da64e00e3a91c339fc625a21f19d393805eb9aa1c5dfbf680b3b450952e951a619ea0a97a6160ca40e9dd5734bbb79ba2a5c109dd2e2b385c5dbdf5c9b45a064a33c2b7fa8dcca1d354ad8164320cf856095f62a8b3449929aedf7fb7526548e07043722bb775cab8b4e45e53cbc7e0b976afc0aacef8dbb463d3560ea46c49374dfef858971c07558bb1e6919d57170c850d875ad4592bbf1fff560bec0089e32dc9dac63847087378d33108cc7d1fadf5888c43482717646" ,
        MONGO_DATABASE_URL: "mongodb+srv://paxy:!Home4301@ap-se-1.kivqnnv.mongodb.net/tarvation_customers?retryWrites=true&w=majority&appName=ap-se-1",
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
