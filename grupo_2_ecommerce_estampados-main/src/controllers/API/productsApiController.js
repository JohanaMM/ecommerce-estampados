const { Sequelize } = require("sequelize");
const db = require("../../database/models");
const { Brand, Category, Genre, Product, Size, Stock } = db;

const API_BASE_URL = process.env.API_URL || "http://localhost:3000";
const urlApi = `${API_BASE_URL}/api/products`;
const urlImg = `${API_BASE_URL}/img`;
const LIMIT = 10;

const productsApiController = {
  list: async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      const countProducts = await Product.count();
      const totalPages = Math.ceil(countProducts / LIMIT);

      if (page > totalPages || page < 1) {
        return res.status(404).json({
          message: "404 Not Found",
          status: 404
        });
      }

      const offset = (page - 1) * LIMIT;
      const allProducts = await Product.findAll({
        attributes: ["id", "name", "img", "price", "created_date"],
        limit: LIMIT,
        offset
      });

      const products = allProducts.map((element) => ({
        ...element.dataValues,
        detail: `${urlApi}/${element.dataValues.id}`
      }));

      const countByCategoryRows = await Product.findAll({
        attributes: [[Sequelize.fn("COUNT", Sequelize.col("Category.id")), "total"]],
        include: [
          { model: Category, required: true, attributes: ["name"] }
        ],
        group: ["Category.id"]
      });

      const countByCategory = Object.fromEntries(
        countByCategoryRows.map((row) => [
          row.dataValues.Category.name,
          row.dataValues.total
        ])
      );

      const data = {
        count: countProducts,
        countByCategory,
        next: page < totalPages ? `${urlApi}/?page=${page + 1}` : null,
        previous: page > 1 ? `${urlApi}/?page=${page - 1}` : null,
        products
      };

      res.json(data);
    } catch (e) {
      console.error("productsApiController.list:", e.message);
      res.status(500).json({
        message: "Error interno del servidor",
        status: 500
      });
    }
  },

  detail: async (req, res) => {
    try {
      const { id } = req.params;
      const oneProduct = await Product.findByPk(id, {
        attributes: ["id", "name", "description", "price", "img", "created_date"],
        include: [
          { model: Brand, required: true, attributes: ["name"] },
          { model: Category, required: true, attributes: ["name"] },
          { model: Genre, required: true, attributes: ["name"] }
        ]
      });

      if (!oneProduct) {
        return res.status(404).json({
          message: "404 Not Found",
          status: 404
        });
      }

      const productSizes = await Stock.findAll({
        attributes: ["available_quantity"],
        include: [{ model: Size, required: true, attributes: ["size"] }],
        where: { product_id: id }
      });

      const stock = productSizes.map((element) => ({
        size: element.dataValues.Size.dataValues.size,
        available_quantity: element.dataValues.available_quantity
      }));

      const product = {
        ...oneProduct.dataValues,
        img: `${urlImg}/${oneProduct.dataValues.img}`,
        Stock: stock,
        Brand: oneProduct.Brand.dataValues.name,
        Category: oneProduct.Category.dataValues.name,
        Genre: oneProduct.Genre.dataValues.name
      };

      res.json(product);
    } catch (e) {
      console.error("productsApiController.detail:", e.message);
      res.status(500).json({
        message: "Error interno del servidor",
        status: 500
      });
    }
  }
};

module.exports = productsApiController;
