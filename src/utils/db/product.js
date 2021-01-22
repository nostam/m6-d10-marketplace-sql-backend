const { Product } = require(".");

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "product",
    {
      _id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      brand: {
        type: DataTypes.STRING(50),
      },
      categoryId: { type: DataTypes.INTEGER, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      price: { type: DataTypes.INTEGER, allowNull: false },
      imageUrl: { type: DataTypes.TEXT },
    },
    { timestamps: true }
  );

  Product.associate = (models) => {
    Product.belongsTo(models.Category);
    Product.hasMany(models.Cart);
    Product.hasMany(models.Review);
    Product.belongsToMany(models.User, { through: models.Cart, unique: false });
  };

  return Product;
};
