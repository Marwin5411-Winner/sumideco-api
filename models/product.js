const { all } = require("../app");

module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
      "Product",
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          unique: true,
          defaultValue: DataTypes.UUIDV4,
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
          type: DataTypes.UUID,
          allowNull: true,
        },
        content: {
            type: DataTypes.STRING,
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
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        size: {
          // width x height x depth in cm
          type: DataTypes.JSON,
          allowNull: true,
          validate: {
            isValidSize(value) {
              if (value && (isNaN(value.width) || isNaN(value.height) || isNaN(value.depth))) {
                throw new Error("Size must be a valid JSON object with numeric width, height, and depth properties.");
              }
            },
          },
        },
        shop_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        includedTax: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        productType: {
          type: DataTypes.ENUM(
            'Digital product',
            'Course or tutorial',
            'E-book',
            'Membership',
            'Physical good',
            'Bundle'
          ),
          allowNull: false,
          defaultValue: 'Physical good',
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "Draft"
        },
        revenue: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0.00
        },
        sales: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        deleted: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        tableName: "products",
        timestamps: true, // Adds createdAt and updatedAt timestamps
        paranoid: true,  // Adds deletedAt timestamp (soft deletes)
      }
    );
  };