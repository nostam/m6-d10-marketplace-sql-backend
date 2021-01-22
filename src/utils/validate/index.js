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
  body("text").notEmpty().isString(),
  body("author_id").isInt(),
];

const validateCategory = [
  body("name").notEmpty().isString(),
  body("img").isURL(),
];

module.exports = { validateProduct, validateReview, validateCategory };
