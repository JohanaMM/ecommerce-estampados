const db = require("../../database/models");
const { Order } = db;

const STATUS_FINALIZADA = 3;

module.exports = {
  listByUser: async (req, res) => {
    try {
      const userId = parseInt(req.query.userId || req.params.userId, 10);
      if (!userId) {
        return res.status(400).json({ message: "Falta userId", status: 400 });
      }
      const orders = await Order.findAll({
        where: { user_id: userId },
        order: [["created_date", "DESC"]],
      });
      const list = (orders || []).map((o) => ({
        id: o.id,
        total: o.total,
        created_date: o.created_date,
        status_id: o.status_id,
        shipping_status: o.shipping_status || "pendiente",
      }));
      res.json(list);
    } catch (e) {
      console.error("ordersApiController.listByUser:", e.message);
      res.status(500).json({ message: "Error del servidor", status: 500 });
    }
  },

  create: async (req, res) => {
    try {
      const { userId, total } = req.body;
      const user_id = parseInt(userId, 10);
      const totalNum = Math.round(Number(total) || 0);
      if (!user_id || totalNum <= 0) {
        return res.status(400).json({ message: "userId y total son obligatorios", status: 400 });
      }
      let order;
      try {
        order = await Order.create({
          user_id,
          total: totalNum,
          status_id: STATUS_FINALIZADA,
          shipping_status: "pendiente",
        });
      } catch (err) {
        if (err.message && err.message.includes("Unknown column") && err.message.includes("shipping_status")) {
          order = await Order.create({
            user_id,
            total: totalNum,
            status_id: STATUS_FINALIZADA,
          });
        } else {
          throw err;
        }
      }
      res.status(201).json({ id: order.id, total: order.total, created_date: order.created_date });
    } catch (e) {
      console.error("ordersApiController.create:", e.message);
      res.status(500).json({ message: "Error del servidor", status: 500 });
    }
  },
};
