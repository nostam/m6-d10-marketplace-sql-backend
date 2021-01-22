const CategoriesRouter = require("express").Router();
const { validationResult } = require("express-validator");
const { validateCategory } = require("../../utils/validate");
const { Category } = require("../../utils/db");

CategoriesRouter.route("/")
  .get(async (req, res, next) => {
    try {
      const categories = await Categories.findAll();
      res.send(categories);
    } catch (e) {
      next(e);
    }
  })
  .post(validateCategory, async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(err(errors.array(), 404));
      const newCategory = await Categories.create(req.body);
      res.status(201).send(newCategory);
    } catch (e) {
      next(e);
    }
  });

CategoriesRouter.route("/:id")
  .get(async (req, res, next) => {
    try {
      const category = await Category.findByPk(req.pararms.id);
      res.send(category);
    } catch (e) {
      next(e);
    }
  })
  .put(validateCategory, async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(err(errors.array(), 404));
      const categoryArr = await Category.update(req.body, {
        returning: true,
        plain: true,
        where: { id: req.params.id },
      });
      res.send(categoryArr[1]);
    } catch (e) {
      next(e);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const request = await Category.destroy({ where: { id: req.params.id } });
      if (request === 0) next(err("ID not found", 404));
      res.send("Deleted");
    } catch (e) {
      next(e);
    }
  });

module.exports = CategoriesRouter;
