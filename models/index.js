const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(process.env.POSTGRES_DATABASE_URL);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Postgres Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

const db = {};

// Import models
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Shop = require("./shop")(sequelize, DataTypes);
db.Customer = require("./customer")(sequelize, DataTypes);
db.Product = require("./product")(sequelize, DataTypes);
db.Order = require("./order")(sequelize, DataTypes);
db.Category = require("./category")(sequelize, DataTypes);
db.ProductCategory = require("./product_category")(sequelize, DataTypes);
db.ShopSecret = require("./shop_secrets")(sequelize, DataTypes);
db.ShopDetail = require("./shop_detail")(sequelize, DataTypes);

// Define relationships
// One-to-Many: Shop to Customer
db.Shop.hasMany(db.Customer, { foreignKey: "shop_id" });
db.Customer.belongsTo(db.Shop, { foreignKey: "shop_id" });

// One-to-Many: Shop to Product
db.Shop.hasMany(db.Product, { foreignKey: "shop_id" });
db.Product.belongsTo(db.Shop, { foreignKey: "shop_id" });

// One-to-Many: Shop to Order
db.Shop.hasMany(db.Order, { foreignKey: "shop_id" });
db.Order.belongsTo(db.Shop, { foreignKey: "shop_id" });

// One-to-One: Shop to ShopSecret
db.Shop.hasOne(db.ShopSecret, { foreignKey: "shop_id" });
db.ShopSecret.belongsTo(db.Shop, { foreignKey: "shop_id" });

// One-to-One: Shop to ShopDetail
db.Shop.hasOne(db.ShopDetail, { foreignKey: "shop_id" });
db.ShopDetail.belongsTo(db.Shop, { foreignKey: "shop_id" });

// Many-to-Many: Product to Category through ProductCategory
db.Product.belongsToMany(db.Category, { through: db.ProductCategory, foreignKey: "product_id" });
db.Category.belongsToMany(db.Product, { through: db.ProductCategory, foreignKey: "category_id" });

async function initializeDatabase() {
  // Test connection
  await testConnection();

  // Synchronize models
  // Synchronize tables that do not involve foreign key relationships first
  await Promise.all([
    db.Shop.sync({ alter: true }),
    db.Category.sync({ alter: true }),
  ]);

  // Synchronize child tables next
  await Promise.all([
    db.Customer.sync({ alter: true }),
    db.Product.sync({ alter: true }),
    db.Order.sync({ alter: true }),
    db.ProductCategory.sync({ alter: true }),
    db.ShopSecret.sync({ alter: true }),
    db.ShopDetail.sync({ alter: true })
  ]);
}

initializeDatabase();

module.exports = db;