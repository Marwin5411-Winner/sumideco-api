module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "ShopDetail",
    {
      shop_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      headline: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      logo_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "THB",
      },
      currency_symbol: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "฿",
      },
      paymentFeePercentage: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 15.0,
      },
      balance: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0,
      },
      total_products: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      total_earning: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0,
      },
      total_sales: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0,
      },
      total_products_sold: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      payout_details: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {
          bank: [],
        },
      },
    },
    {
      tableName: "shops_details",
      paranoid: true
    }
  );
};
