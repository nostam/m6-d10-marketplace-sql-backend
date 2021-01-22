const ProductRouter = require("express").Router();
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const { validateProduct, validateReview } = require("../../utils/validate");
const { Category, User, Product, Review } = require("../../utils/db");
const { err } = require("../../utils");

ProductRouter.route("/")
  .get(async (req, res, next) => {
    try {
      const data = await Product.findAll({
        include: [{ model: User }, { model: Category }],
      });
      res.send(data);
    } catch (e) {
      next(e);
    }
  })
  .post(validateProduct, async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(err(errors.array(), 400));
      const newProduct = await Product.create(req.body);
      res.status(201).send(newProduct);
    } catch (e) {
      next(e);
    }
  });

ProductRouter.route("/:id")
  .get(async (req, res, next) => {
    try {
      const Product = await Product.findByPk(req.params.id);
      res.send(Product);
    } catch (e) {
      next(e);
    }
  })
  .post(validateReview, async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) next(err(errors.array(), 404));
      const newReview = await Review.create(req.body);
      res.status(201).send();
    } catch (error) {
      next(error);
    }
  })
  .put(validateProduct, async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) next(err(errors.array(), 404));
      const ProductArr = await Product.update(req.body, {
        returning: true,
        plain: true,
        where: { id: req.params.id },
      });
      res.send(ProductArr[1]);
    } catch (e) {
      next(e);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const request = await Product.destroy({ where: { id: req.params.id } });
      if (request === 0) next(err("ID not found", 404));
      res.send("Deleted");
    } catch (e) {
      next(e);
    }
  });

ProductRouter.get("/:ProductId/reviews", async (req, res, next) => {
  try {
    //TODO pagination
    const data = await Review.findAll({
      include: User,
    });

    res.send(data);
  } catch (error) {
    next(error);
  }
});

ProductRouter.route("/:ProductId/reviews/:reviewId")
  .get(async (req, res, next) => {
    try {
      const review = await Review.findByPk(req.params.reviewId);
      res.send(review);
    } catch (error) {
      next(error);
    }
  })
  .put(async (req, res, next) => {
    try {
      //TODO fe not implemented yet
      const res = await Reviews.findByIdAndUpdate(req.params.reviewId, {
        text: req.body.text,
        Product_id: req.params.ProductId,
      });
      res.send(res);
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const { rows } = await Reviews.findByIdAndDelete(req.params.reviewId);
      res.send(rows);
    } catch (error) {
      next(error);
    }
  });

module.exports = ProductRouter;
