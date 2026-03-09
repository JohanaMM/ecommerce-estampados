const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");
const db = require("../../database/models");
const { Brand, Category, Genre, Product, Size, Stock } = db;

const API_BASE_URL = process.env.API_URL || "http://localhost:3000";
const urlApi = `${API_BASE_URL}/api/products`;
const urlImg = `${API_BASE_URL}/img`;
const LIMIT = 50;

const productsApiController = {
  list: async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      const categoryName = (req.query.category || "").trim();
      const theme = (req.query.theme || "").trim();
      const q = (req.query.q || "").trim();

      let where = { is_active: 1 };
      const filterByCategory = categoryName && categoryName.toLowerCase() !== "todos";
      const filterByTheme = theme && theme.toLowerCase() !== "todos";

      const include = [
        {
          model: Category,
          required: filterByCategory,
          attributes: ["id", "name"],
          ...(filterByCategory && { where: { name: { [Op.like]: `%${categoryName}%` } } })
        },
        { model: Brand, required: false, attributes: ["name"] }
      ];

      if (filterByTheme) {
        const themeNorm = theme.charAt(0).toUpperCase() + theme.slice(1).toLowerCase();
        if (themeNorm === "Música") {
          where = { ...where, [Op.or]: [{ theme: { [Op.like]: "%Música%" } }, { theme: { [Op.like]: "%Bandas%" } }] };
        } else {
          where = { ...where, theme: { [Op.like]: `%${theme}%` } };
        }
      }
      if (q) {
        where = { ...where, [Op.or]: [{ name: { [Op.like]: `%${q}%` } }, { description: { [Op.like]: `%${q}%` } }] };
      }

      let countProducts;
      let allProducts;
      const baseOpts = { where, include, limit: LIMIT, offset: (page - 1) * LIMIT };
      try {
        countProducts = await Product.count({ where, include });
        allProducts = await Product.findAll({
          ...baseOpts,
          attributes: ["id", "name", "img", "price", "created_date", "theme"]
        });
      } catch (err) {
        if (err.message && err.message.includes("Unknown column") && err.message.includes("theme")) {
          where = { is_active: 1 };
          if (q) where = { ...where, [Op.or]: [{ name: { [Op.like]: `%${q}%` } }, { description: { [Op.like]: `%${q}%` } }] };
          countProducts = await Product.count({ where, include });
          allProducts = await Product.findAll({
            where,
            include,
            limit: LIMIT,
            offset: (page - 1) * LIMIT,
            attributes: ["id", "name", "img", "price", "created_date"]
          });
        } else {
          throw err;
        }
      }

      const totalPages = Math.ceil(countProducts / LIMIT) || 1;

      const products = allProducts.map((element) => {
        const row = { ...element.dataValues };
        const cat = element.Category;
        const brand = element.Brand;
        row.category = cat ? cat.name : null;
        row.brand = brand ? brand.name : null;
        row.detail = `${urlApi}/${row.id}`;
        delete row.Category;
        delete row.Brand;
        return row;
      });

      const countByCategoryRows = await Product.findAll({
        attributes: [[Sequelize.fn("COUNT", Sequelize.col("Product.id")), "total"], "Category.name"],
        include: [
          { model: Category, required: false, attributes: ["name"] }
        ],
        where: { is_active: 1 },
        group: ["Category.id", "Category.name"]
      });

      const countByCategory = Object.fromEntries(
        countByCategoryRows.map((row) => [
          (row.dataValues.Category && row.dataValues.Category.name) || "Sin categoría",
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
      let oneProduct = await Product.findByPk(id, {
        attributes: ["id", "name", "description", "price", "img", "created_date", "theme"],
        include: [
          { model: Brand, required: false, attributes: ["name"] },
          { model: Category, required: false, attributes: ["name"] },
          { model: Genre, required: false, attributes: ["name"] }
        ]
      });
      let imagesJson = null;
      if (oneProduct) {
        try {
          const withImages = await Product.findByPk(id, { attributes: ["images"] });
          if (withImages && withImages.dataValues && withImages.dataValues.images != null) {
            imagesJson = withImages.dataValues.images;
          }
        } catch (_) {}
      }

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

      const mainImg = `${urlImg}/${oneProduct.dataValues.img}`;
      let images = [mainImg];
      if (imagesJson) {
        try {
          const parsed = JSON.parse(imagesJson);
          if (Array.isArray(parsed) && parsed.length > 0) {
            images = parsed.map((path) => (path.startsWith("http") ? path : `${urlImg}/${path}`));
          }
        } catch (_) {}
      }
      const product = {
        ...oneProduct.dataValues,
        img: mainImg,
        images,
        Stock: stock,
        Brand: oneProduct.Brand ? oneProduct.Brand.dataValues.name : null,
        Category: oneProduct.Category ? oneProduct.Category.dataValues.name : null,
        Genre: oneProduct.Genre ? oneProduct.Genre.dataValues.name : null
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
