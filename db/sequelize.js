const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(process.env.POSTGRES_DATABASE_URL);

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
  "shops",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      unique: true,
      defaultValue: Sequelize.UUIDV4,
    },
    ssoId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
    email: {
      type: DataTypes.STRING,
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

const customers = sequelize.define(
  "customers",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      unique: true,
      defaultValue: Sequelize.UUIDV4,
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
      type: DataTypes.STRING,
      allowNull: true,
    },
    shop_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "customers",
  }
);

const products = sequelize.define(
  "products",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      unique: true,
      defaultValue: Sequelize.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    weight: {
      // in grams
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    size: {
      // width x height x depth in cm
      type: DataTypes.JSON,
      allowNull: true,
    },
    shop_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "products",
  }
);

const orders = sequelize.define(
  "orders",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      unique: true,
      defaultValue: Sequelize.UUIDV4,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    item_list: {
      // [{product_id, quantity}]
      type: DataTypes.JSON,
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    discount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    coupon_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    shop_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "รอยืนยัน",
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "orders",
  }
);

const carts = sequelize.define(
  "carts",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      unique: true,
      defaultValue: Sequelize.UUIDV4,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    item_list: {
      // [{product_id, quantity}]
      type: DataTypes.JSON,
      allowNull: false,
    },
    shop_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "carts",
  }
);

const categories = sequelize.define(
  "categories",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      unique: true,
      defaultValue: Sequelize.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    parentCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    shop_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "categories",
  }
);

const product_category = sequelize.define(
  "product_category",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      unique: true,
      defaultValue: Sequelize.UUIDV4,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "product_category",
  }
);

//Define relationships
/// Many to Many Categories - Products
categories.belongsToMany(products, { through: "Product_Category" });
products.belongsToMany(categories, { through: "Product_Category" });

// Test connection
testConnection();

sequelize.sync();
module.exports = {
  shops,
  customers,
  products,
  orders,
  carts,
  categories,
  product_category,
};
