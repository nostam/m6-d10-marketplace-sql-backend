const { body } = require("express-validator");

const validateProduct = [
  body("name").notEmpty().isString(),
  body("description").notEmpty().isString(),
  body("categoryId").isInt(),
  body("price").isInt(),
  body("brand").isString(),
  body("imageUrl").isURL(),
];

const validateReview = [
  body("userId", "Invalid ID").isNumeric(),
  body("rating", "Rate between 0 to 5").isInt({ min: 0, max: 5 }),
];

const validateCategory = [
  body("name").notEmpty().isString(),
  body("img").isURL(),
];

module.exports = { validateProduct, validateReview, validateCategory };
