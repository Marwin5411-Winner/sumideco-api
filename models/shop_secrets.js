module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
      "ShopSecret",
      {
        shop_id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          unique: true,
        },
        stripe_secret: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        stripe_public: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        tableName: "shop_secrets",
      }
    );
  };