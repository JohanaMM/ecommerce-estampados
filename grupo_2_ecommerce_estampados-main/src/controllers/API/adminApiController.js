const path = require("path");
const db = require("../../database/models");
const { Product, Category, Stock, Size, Order, User } = db;
const API_BASE_URL = process.env.API_URL || "http://localhost:3000";
const urlImg = `${API_BASE_URL}/img`;

const listProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category, attributes: ["id", "name"] },
        { model: Stock, include: [{ model: Size, attributes: ["id", "size"] }] },
      ],
      order: [["id", "DESC"]],
    });
    const list = (products || []).map((p) => {
      const row = p.toJSON ? p.toJSON() : p;
      const totalStock = (row.Stocks || []).reduce((sum, s) => sum + (s.available_quantity || 0), 0);
      return {
        id: row.id,
        name: row.name,
        description: row.description,
        price: row.price,
        img: row.img ? `${urlImg}/${row.img}` : null,
        images: row.images,
        theme: row.theme,
        color: row.color,
        is_active: row.is_active,
        category_id: row.category_id,
        Category: row.Category,
        Stocks: row.Stocks,
        totalStock,
        created_date: row.created_date,
      };
    });
    res.json(list);
  } catch (e) {
    console.error("adminApiController.listProducts:", e.message);
    res.status(500).json({ message: "Error del servidor", status: 500 });
  }
};

const createProduct = async (req, res) => {
  try {
    const files = req.files && req.files.length ? req.files : [];
    const imageName = files[0] ? files[0].filename : "default-shoes.jpg";
    const imagesJson = files.length > 0 ? JSON.stringify(files.map((f) => f.filename)) : null;
    const body = req.body;
    const name = (body.name || "").trim();
    const description = (body.description || "").trim();
    const price = Math.round(Number(body.price) || 0);
    let category_id = body.category_id != null && body.category_id !== "" ? parseInt(body.category_id, 10) : null;
    const category_name = (body.category_name || "").trim();
    if (!category_id && category_name) {
      const [cat] = await Category.findOrCreate({ where: { name: category_name }, defaults: { name: category_name, is_active: 1 } });
      category_id = cat.id;
    }

    let size_id = body.size_id != null && body.size_id !== "" ? parseInt(body.size_id, 10) : null;
    const size_name = (body.size_name || "").trim();
    if (!size_id && size_name) {
      const [sz] = await Size.findOrCreate({ where: { size: size_name }, defaults: { size: size_name } });
      size_id = sz.id;
    }
    if (!size_id) size_id = 1;

    const theme = (body.theme || "").trim() || null;
    const color = (body.color || "").trim() || null;
    const stock = Math.max(0, parseInt(body.stock, 10) || 0);

    if (!name || !description) {
      return res.status(400).json({ message: "Nombre y descripción son obligatorios", status: 400 });
    }

    const payload = {
      name,
      description,
      price: price || 0,
      img: imageName,
      images: imagesJson,
      is_active: 1,
      category_id: category_id || null,
      brand_id: null,
      genre_id: null,
      theme,
    };
    if (color) payload.color = color;

    let product;
    try {
      product = await Product.create(payload);
    } catch (err) {
      if (err.message && err.message.includes("Unknown column")) {
        if (err.message.includes("theme")) delete payload.theme;
        if (err.message.includes("color")) delete payload.color;
        if (err.message.includes("images")) delete payload.images;
        try {
          product = await Product.create(payload);
        } catch (e2) {
          throw err;
        }
      } else {
        throw err;
      }
    }

    if (stock > 0) {
      await Stock.create({
        product_id: product.id,
        size_id,
        available_quantity: stock,
      });
    }

    res.status(201).json({
      id: product.id,
      name: product.name,
      message: "Producto creado",
    });
  } catch (e) {
    console.error("adminApiController.createProduct:", e.message);
    res.status(500).json({ message: e.message || "Error del servidor", status: 500 });
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado", status: 404 });
    }

    const body = req.body;
    const updates = {};
    if (body.name !== undefined) updates.name = String(body.name).trim();
    if (body.description !== undefined) updates.description = String(body.description).trim();
    if (body.price !== undefined) updates.price = Math.round(Number(body.price)) || 0;
    if (body.theme !== undefined) updates.theme = body.theme ? String(body.theme).trim() : null;
    if (body.color !== undefined) {
      const colorVal = body.color ? String(body.color).trim() : null;
      if (colorVal) updates.color = colorVal;
      else updates.color = null;
    }
    if (body.category_id !== undefined && body.category_id !== "") {
      updates.category_id = parseInt(body.category_id, 10) || null;
    } else if (body.category_name !== undefined && String(body.category_name).trim()) {
      const [cat] = await Category.findOrCreate({ where: { name: String(body.category_name).trim() }, defaults: { name: String(body.category_name).trim(), is_active: 1 } });
      updates.category_id = cat.id;
    }
    if (body.is_active !== undefined) updates.is_active = (body.is_active === "1" || body.is_active === true) ? 1 : 0;
    const upFiles = req.files && req.files.length ? req.files : [];
    if (upFiles.length > 0) {
      updates.img = upFiles[0].filename;
      updates.images = JSON.stringify(upFiles.map((f) => f.filename));
    }
    updates.modified_date = new Date();

    try {
      await product.update(updates);
    } catch (err) {
      if (err.message && err.message.includes("Unknown column")) {
        if (err.message.includes("theme")) delete updates.theme;
        if (err.message.includes("color")) delete updates.color;
        if (err.message.includes("images")) delete updates.images;
        try {
          await product.update(updates);
        } catch (e2) {
          throw err;
        }
      } else {
        throw err;
      }
    }

    if (body.stock !== undefined) {
      const stockNum = Math.max(0, parseInt(body.stock, 10) || 0);
      let sizeId = body.size_id != null && body.size_id !== "" ? parseInt(body.size_id, 10) : null;
      if (!sizeId && body.size_name) {
        const [sz] = await Size.findOrCreate({ where: { size: String(body.size_name).trim() }, defaults: { size: String(body.size_name).trim() } });
        sizeId = sz.id;
      }
      if (!sizeId) sizeId = 1;
      const existing = await Stock.findOne({ where: { product_id: id, size_id: sizeId } });
      if (existing) {
        await existing.update({ available_quantity: stockNum, modified_date: new Date() });
      } else if (stockNum > 0) {
        await Stock.create({
          product_id: id,
          size_id: sizeId,
          available_quantity: stockNum,
        });
      }
    }

    res.json({ id: product.id, message: "Producto actualizado" });
  } catch (e) {
    console.error("adminApiController.updateProduct:", e.message);
    res.status(500).json({ message: e.message || "Error del servidor", status: 500 });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado", status: 404 });
    }
    await product.update({ is_active: 0, modified_date: new Date() });
    res.json({ message: "Producto desactivado" });
  } catch (e) {
    console.error("adminApiController.deleteProduct:", e.message);
    res.status(500).json({ message: "Error del servidor", status: 500 });
  }
};

const activateProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado", status: 404 });
    }
    await product.update({ is_active: 1, modified_date: new Date() });
    res.json({ message: "Producto activado" });
  } catch (e) {
    console.error("adminApiController.activateProduct:", e.message);
    res.status(500).json({ message: "Error del servidor", status: 500 });
  }
};

const getProductForEdit = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const product = await Product.findByPk(id, {
      include: [
        { model: Category, attributes: ["id", "name"] },
        { model: Stock, include: [{ model: Size, attributes: ["id", "size"] }] },
      ],
    });
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado", status: 404 });
    }
    const row = product.toJSON ? product.toJSON() : product;
    const totalStock = (row.Stocks || []).reduce((sum, s) => sum + (s.available_quantity || 0), 0);
    const firstStock = (row.Stocks || [])[0];
    res.json({
      ...row,
      img: row.img ? `${urlImg}/${row.img}` : null,
      totalStock,
      size_id: firstStock ? firstStock.size_id : null,
    });
  } catch (e) {
    console.error("adminApiController.getProductForEdit:", e.message);
    res.status(500).json({ message: "Error del servidor", status: 500 });
  }
};

const listOrders = async (req, res) => {
  try {
    const pendingOnly = req.query.pending === "1" || req.query.pending === "true";
    const where = {};
    if (pendingOnly) {
      where[db.Sequelize.Op.or] = [
        { shipping_status: "pendiente" },
        { shipping_status: null },
      ];
    }
    let orders = [];
    try {
      orders = await Order.findAll({
        where,
        order: [["created_date", "DESC"]],
        include: [{ model: User, as: "User", attributes: ["id", "first_name", "last_name", "email"], required: false }],
      });
    } catch (err) {
      if (err.message && (err.message.includes("Unknown column") || err.message.includes("shipping_status"))) {
        orders = await Order.findAll({
          order: [["created_date", "DESC"]],
          include: [{ model: User, as: "User", attributes: ["id", "first_name", "last_name", "email"], required: false }],
        });
      } else {
        throw err;
      }
    }
    const list = (orders || []).map((o) => ({
      id: o.id,
      user_id: o.user_id,
      total: o.total,
      status_id: o.status_id,
      shipping_status: o.shipping_status || "pendiente",
      created_date: o.created_date,
      User: o.User ? (o.User.toJSON ? o.User.toJSON() : o.User) : null,
    }));
    res.json(list);
  } catch (e) {
    console.error("adminApiController.listOrders:", e.message);
    res.status(500).json({ message: "Error del servidor", status: 500 });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado", status: 404 });
    }
    const shipping_status = (req.body.shipping_status || "").trim() || "pendiente";
    await order.update({ shipping_status, modified_date: new Date() });
    res.json({ id: order.id, shipping_status, message: "Estado actualizado" });
  } catch (e) {
    console.error("adminApiController.updateOrderStatus:", e.message);
    res.status(500).json({ message: "Error del servidor", status: 500 });
  }
};

const DEFAULT_CATEGORIES = [
  "Remeras", "Buzos", "Pad mouse", "Tazas", "Termos", "Gorras", "Stickers",
];
const DEFAULT_SIZES = ["S", "M", "L", "XL", "XXL"];

const getCatalog = async (req, res) => {
  try {
    // Asegurar que existan categorías (Remeras, Termos, etc.) y talles S, M, L, XL, XXL
    for (const name of DEFAULT_CATEGORIES) {
      await Category.findOrCreate({ where: { name }, defaults: { name, is_active: 1 } });
    }
    for (const sizeName of DEFAULT_SIZES) {
      await Size.findOrCreate({ where: { size: sizeName }, defaults: { size: sizeName } });
    }

    const [allCategories, allSizes] = await Promise.all([
      Category.findAll({ attributes: ["id", "name"], order: [["name", "ASC"]] }),
      Size.findAll({ attributes: ["id", "size"], order: [["id", "ASC"]] }),
    ]);

    // Categorías sin duplicados: solo las que coinciden con DEFAULT_CATEGORIES, una por nombre
    const categoryNamesNormalized = new Set();
    const categories = (allCategories || [])
      .filter((c) => {
        const name = (c.name || "").trim();
        const key = name.toLowerCase();
        if (categoryNamesNormalized.has(key)) return false;
        if (!DEFAULT_CATEGORIES.some((d) => d.toLowerCase() === key)) return false;
        categoryNamesNormalized.add(key);
        return true;
      })
      .map((c) => ({ id: c.id, name: (c.name || "").trim() }))
      .sort((a, b) => a.name.localeCompare(b.name));

    // Solo talles S, M, L, XL, XXL y sin duplicados
    const sizeValuesSeen = new Set();
    const sizes = (allSizes || [])
      .filter((s) => {
        const val = String(s.size || "").trim().toUpperCase();
        if (!DEFAULT_SIZES.map((d) => d.toUpperCase()).includes(val)) return false;
        if (sizeValuesSeen.has(val)) return false;
        sizeValuesSeen.add(val);
        return true;
      })
      .map((s) => ({ id: s.id, size: String(s.size).trim() }))
      .sort((a, b) => {
        const order = DEFAULT_SIZES.map((d) => d.toUpperCase());
        return order.indexOf(a.size.toUpperCase()) - order.indexOf(b.size.toUpperCase());
      });

    res.json({
      categories: categories.length ? categories : DEFAULT_CATEGORIES.map((name, i) => ({ id: i + 1, name })),
      sizes: sizes.length ? sizes : DEFAULT_SIZES.map((size, i) => ({ id: i + 1, size })),
    });
  } catch (e) {
    console.error("adminApiController.getCatalog:", e.message);
    res.status(500).json({ message: "Error del servidor", status: 500 });
  }
};

module.exports = {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  activateProduct,
  getProductForEdit,
  listOrders,
  updateOrderStatus,
  getCatalog,
};
