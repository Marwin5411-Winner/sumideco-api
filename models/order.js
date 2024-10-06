module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
      "Order",
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          unique: true,
          defaultValue: DataTypes.UUIDV4,
        },
        customer_id: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        phone_number: {
          type: DataTypes.STRING,
          allowNull: true,
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
          type: DataTypes.UUID,
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
          defaultValue: "pending",
        },
        total: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        total_revenue: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0.00
        },
        platformFee: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0.00
        },
        stripe_data: {
          type: DataTypes.JSON,
          allowNull: true
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
  };