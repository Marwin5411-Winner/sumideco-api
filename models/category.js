module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
      "Category",
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
        parentCategoryId: {
          type: DataTypes.UUID,
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
  };