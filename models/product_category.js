module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
      "ProductCategory",
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          unique: true,
          defaultValue: DataTypes.UUIDV4,
        },
        product_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        category_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },
      },
      {
        tableName: "product_category",
      }
    );
  };