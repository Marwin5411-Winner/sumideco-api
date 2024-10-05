module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
      "Collection",
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
          type: DataTypes.TEXT,
          allowNull: true,
        },
        thumbnail: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        featured: {
          // Whether this collection is featured on the website
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        shop_id: {
          // The shop that owns this collection
          type: DataTypes.UUID,
          allowNull: false,
        },
        status: {
          // The status of the collection (Published, Draft, Archived, etc.)
          type: DataTypes.ENUM('Published', 'Draft', 'Archived'),
          defaultValue: 'Draft',
        },
        deleted: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        tableName: "collections",
        timestamps: true, // Adds createdAt and updatedAt timestamps
        paranoid: true,  // Adds deletedAt timestamp (soft deletes)
      }
    );
  };
  