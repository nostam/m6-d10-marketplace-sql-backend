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
      res.status(201).send();
    } catch (e) {
      next(e);
    }
  });

module.exports = ReviewsRouter;
