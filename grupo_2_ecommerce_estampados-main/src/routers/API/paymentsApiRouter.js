const express = require("express");
const router = express.Router();
const { MercadoPagoConfig, Preference } = require("mercadopago");

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
let preferenceClient = null;
if (accessToken) {
  const client = new MercadoPagoConfig({ accessToken });
  preferenceClient = new Preference(client);
}

router.post("/create_preference", async (req, res) => {
  console.log("[Pagos] Petición create_preference recibida");

  if (!accessToken || !preferenceClient) {
    console.warn("[Pagos] MERCADOPAGO_ACCESS_TOKEN no está configurado en .env");
    return res.status(503).json({
      error: "Servicio de pagos no configurado. Configure MERCADOPAGO_ACCESS_TOKEN en .env y reinicie el servidor."
    });
  }

  try {
    const { cart } = req.body;
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "Carrito inválido o vacío" });
    }

    const baseUrl = (process.env.FRONTEND_URL || "http://localhost:3002").replace(/\/$/, "");
    const successUrl = `${baseUrl}/success`;
    const failureUrl = `${baseUrl}/failure`;
    const pendingUrl = `${baseUrl}/pending`;

    const items = cart.map((product, index) => {
      const item = {
        id: String(product.id || `item-${index + 1}`),
        title: String(product.name).slice(0, 256),
        unit_price: Number(product.price),
        quantity: Number(product.quantity) || 1
      };
      if (process.env.MERCADOPAGO_CURRENCY) {
        item.currency_id = process.env.MERCADOPAGO_CURRENCY;
      }
      return item;
    });

    const body = {
      items,
      back_urls: {
        success: successUrl,
        failure: failureUrl,
        pending: pendingUrl
      }
    };
    // auto_return solo si las URLs son HTTPS (algunas cuentas MP rechazan localhost con auto_return)
    if (successUrl.startsWith("https://")) {
      body.auto_return = "approved";
    }

    const response = await preferenceClient.create({ body });
    const preferenceId = response.id;
    console.log("[Pagos] Preferencia creada:", preferenceId);
    res.json({ id: preferenceId });
  } catch (error) {
    let detail = "Error desconocido";
    if (error && typeof error === "object") {
      detail = error.message || error.error || (error.cause && error.cause.message) || JSON.stringify(error);
    } else if (error) {
      detail = String(error);
    }
    console.error("[Pagos] Error MercadoPago:", detail);
    res.status(500).json({
      error: "Error al crear la preferencia de pago",
      detail
    });
  }
});

module.exports = router;
