const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(process.env.MYSQL_DATABASE_URL);

async function testConnection() {
  await sequelize
    .authenticate()
    .then(() => {
      console.log("MYSQL Connection has been established successfully.");
    })
    .catch((error) => {
      console.error("Unable to connect to the database:", error);
    });
}

const shops = sequelize.define(
  "Shops",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ssoId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "user",
      allowNull: false,
    },
    shop_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shop_description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "shops",
  }
);

const customers = sequelize.define('Customers', {
  // Model attributes are defined here
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  shop_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'customers'
});




testConnection();

module.exports = { shops, customers };
