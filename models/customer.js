module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
      "Customer",
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
        cart: {
          type: DataTypes.JSON,
          allowNull: true,
          defaultValue: {
            products: [],
            payment: {
              total: 0.0,
              tax: 0.0,
              currency: null,
            },
          },
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
  };