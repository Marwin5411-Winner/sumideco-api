module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Payout", {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
    },
    shop_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    tranfer_id : {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount : {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: false
    },
    failure_code: {
        type: DataTypes.STRING,
        allowNull: true
    },
    total_fee: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
  },
  {
    tableName: "Payout",
  });
};
