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
        stripe_connect_id : {
          type: DataTypes.STRING,
          allowNull: true,
        },
        omise_recipient_id: {
          type: DataTypes.STRING,
          allowNull: true
        }
      },
      {
        tableName: "shop_secrets",
      }
    );
  };