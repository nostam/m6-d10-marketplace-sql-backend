const router = require("express").Router();
const productsRouter = require("./products");
const usersRouter = require("./users");
const categoriesRouter = require("./categories");
const reviewsRouter = require("./reviews");

router.use("/products", productsRouter);
router.use("/users", usersRouter);
router.use("/categories", categoriesRouter);
router.use("/reviews", reviewsRouter);

module.exports = router;
