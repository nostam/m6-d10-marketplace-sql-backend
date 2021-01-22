const ReviewsRouter = require("express").Router();
const { validationResult } = require("express-validator");
const { Review, User } = require("../../utils/db");
const { err } = require("../../utils");
const { validateReview } = require("../../utils/validate");

ReviewsRouter.route("/")
  .get(async (req, res, next) => {
    try {
      const data = await Review.findAll({
        include: User,
      });
      res.send(data);
    } catch (e) {
      next(e);
    }
  })
  .post(validateReview, async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(err(errors.array(), 404));
      const newReview = await Review.create(req.body);
      res.status(201).send(newReview);
    } catch (e) {
      next(e);
    }
  });

ReviewsRouter.route("/:id")
  .get(async (req, res, next) => {
    try {
      const review = await Review.findByPk(req.params.reviewId);
      res.send(review);
    } catch (error) {
      next(error);
    }
  })
  .put(validateReview, async (req, res, next) => {
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

module.exports = ReviewsRouter;
