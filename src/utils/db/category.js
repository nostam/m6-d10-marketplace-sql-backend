module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "category",
    {
      _id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      img: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  Category.associate = (models) => {
    Category.hasMany(models.Product);
  };
  return Category;
};
