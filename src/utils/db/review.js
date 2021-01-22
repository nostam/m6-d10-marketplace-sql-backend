module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define(
    "review",
    {
      _id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      rate: { type: DataTypes.INTEGER, allowNull: false },
      productId: { type: DataTypes.INTEGER, allowNull: false },
    },
    { timestamps: true }
  );
  Review.associate = (models) => {
    Review.belongsTo(models.Product, {
      through: models.Author,
    });
    Review.belongsTo(models.User, {
      through: models.Product,
    });
  };
  return Review;
};
