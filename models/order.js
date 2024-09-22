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
  };