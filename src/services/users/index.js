const UsersRouter = require("express").Router();
const { User } = require("../../utils/db");

UsersRouter.route("/")
  .get(async (req, res, next) => {
    try {
      const data = await User.findAll();
      res.send(data);
    } catch (e) {
      next(e);
    }
  })
  .post(async (req, res, next) => {
    try {
      const newUser = await User.create(req.body);
      res.status(201).send(newUser);
    } catch (e) {
      next(e);
    }
  });

UsersRouter.route("/:id")
  .get(async (req, res, next) => {
    try {
      const User = await Users.findByPk(req.params.id);
      res.send(User);
    } catch (e) {
      next(e);
    }
  })
  .put(async (req, res, next) => {
    try {
      const UserArr = await Users.update(req.body, {
        returning: true,
        plain: true,
        where: { id: req.params.id },
      });
      res.send(UserArr[1]);
    } catch (e) {
      next(e);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const request = await Users.destory({ where: { id: req.params.id } });
      if (request === 0) next(err("ID not found", 404));
      res.send("Deleted");
    } catch (e) {
      next(e);
    }
  });

module.exports = UsersRouter;
