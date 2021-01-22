const ProductRouter = require("express").Router();
const { validationResult } = require("express-validator");
const { Op, Sequelize } = require("sequelize");
const { validateProduct, validateReview } = require("../../utils/validate");
const { Category, User, Product, Review } = require("../../utils/db");
const { err } = require("../../utils");
const { extname } = require("path");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../../utils/cloudinary");
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "striveTest",
    allowedFormats: ["jpg", "png", "jpeg"],
  },
});
const uploadCloudinary = multer({ storage: storage });
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    const ext = extname(file.originalname);
    const mime = file.mimetype;
    if (
      ext !== ".jpg" &&
      ext !== ".jpeg" &&
      ext !== ".png" &&
      mime !== "image/png" &&
      mime !== "image/jpg" &&
      mime !== "image/jpeg"
    ) {
      return callback(new Error("Only images under 200kb are allowed"));
    }
    callback(null, true);
  },
  limits: { fileSize: 200000 },
});

ProductRouter.route("/")
  .get(async (req, res, next) => {
    try {
      const data = await Product.findAll(
        {
          include: [
            { model: Review },
            { model: Category, attributes: ["_id", "name"] },
          ],
          where: req.query.category
            ? {
                name: { [Op.iLike]: "%" + req.query.category + "%" },
              }
            : {},
          order: ["_id"],
        },
        // { //sequelize.query depreciated
        //   attributes: [
        //     [
        //       Sequelize.query(
        //         "SELECT c.name AS category FROM categories AS c WHERE c._id = p.categoryId LEFT OUTER JOIN products AS p ",
        //         { raw: true }
        //       ),
        //     ],
        //   ],
        // },
        // {
        //   attributes: ["category"],
        //   include: [
        //     { model: models.Category, attributes: [[Sequelize.col("name")]] },
        //   ],
        // },
        {
          include: Category,
          where: Product["categoryId"],
          attributes: ["name"],
        },
        {
          where: req.query.name
            ? { name: { [Op.iLike]: "%" + req.query.name + "%" } }
            : {},
        },
        { limit: 25 },
        { offset: req.query.offset ? req.query.offset : 0 }
      );
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

ProductRouter.route("/:id/uploadImg").post(
  uploadCloudinary.single("image"),
  async (req, res, next) => {
    let imageUrl;
    if (req.file && req.file.path) imageUrl = req.file.path;
    try {
      const product = await Product.findByPk(req.params.id);
      const p = { ...product, imageUrl: imageUrl };
      console.log("<<<<<<<<<<", p);
      const updatedProduct = await Product.update(p, {
        returning: true,
        plain: true,
        where: { _id: req.params.id },
      });
      res.status(201).send(updatedProduct[1]);
    } catch (error) {
      next(error);
    }
  }
);

ProductRouter.route("/:id")
  .get(async (req, res, next) => {
    try {
      const data = await Product.findByPk(req.params.id);
      res.send(data);
    } catch (e) {
      next(e);
    }
  })
  .post(
    validateReview,
    uploadCloudinary.single("image"),
    async (req, res, next) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) next(err(errors.array(), 404));
        const newReview = await Review.create(req.body);
        res.status(201).send();
      } catch (error) {
        next(error);
      }
    }
  )
  .put(validateProduct, async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) next(err(errors.array(), 404));
      const ProductArr = await Product.update(req.body, {
        returning: true,
        plain: true,
        where: { _id: req.params.id },
      });
      res.send(ProductArr[1]);
    } catch (e) {
      next(e);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const request = await Product.destroy({ where: { _id: req.params.id } });
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

module.exports = ProductRouter;
