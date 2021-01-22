module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      _id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      surname: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      img: {
        type: DataTypes.TEXT,
      },
      email: {
        type: DataTypes.STRING,
      },
    },
    { timestamps: true }
  );
  User.associate = (models) => {
    User.hasMany(models.Cart);
    User.hasMany(models.Review);
    User.belongsToMany(models.Product, {
      through: { model: models.Cart, unique: false },
    });
  };
  return User;
};
