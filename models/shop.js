module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Shop",
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
      },
      ssoId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      subdomain: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        allowNull: false,
        defaultValue: "active",
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      emailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      shop_title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shop_description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "shops",
      timestamps: true, // Adds createdAt and updatedAt timestamps
      paranoid: true, // Adds deletedAt timestamp (soft deletes)
    }
  );
};
