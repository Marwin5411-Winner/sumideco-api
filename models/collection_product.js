module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
      "CollectionProduct",
      {
        collectionId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "collections",
            key: "id",
          },
        },
        productId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "products",
            key: "id",
          },
        },
      },
      {
        tableName: "collection_product",
        timestamps: false,
      }
    );
  };
  