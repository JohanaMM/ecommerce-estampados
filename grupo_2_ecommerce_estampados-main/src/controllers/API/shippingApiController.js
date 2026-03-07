/**
 * Cotización de envío desde origen fijo: Boyacá 929, Flores, CABA.
 * El precio se calcula según "distancia" simulada (mismo barrio, misma ciudad, otra ciudad).
 * Moto mensajería: mayor entre simulación Uber y Cabify.
 */
const ORIGIN = {
  calle: "Boyacá",
  numero: "929",
  barrio: "Flores",
  localidad: "Flores",
  ciudad: "CABA",
  provincia: "Ciudad Autónoma de Buenos Aires",
};

function randomInRange(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

function getZoneMultiplier(origin, dest) {
  const sameBarrio = origin.ciudad === dest.ciudad && origin.localidad === dest.localidad && origin.barrio === dest.barrio;
  const sameCiudad = origin.ciudad === dest.ciudad;
  if (sameBarrio) return 0.6;
  if (sameCiudad) return 1;
  return 1.8;
}

const shippingApiController = {
  quote: async (req, res) => {
    try {
      const { address, shippingMethod } = req.body;
      if (!shippingMethod) {
        return res.status(400).json({ error: "Falta shippingMethod (andreani, correo o moto)" });
      }

      const methods = ["andreani", "correo", "moto"];
      if (!methods.includes(shippingMethod)) {
        return res.status(400).json({ error: "shippingMethod debe ser andreani, correo o moto" });
      }

      const dest = {
        ciudad: (address && address.address_ciudad) ? String(address.address_ciudad) : (address && address.address_city) ? String(address.address_city) : "",
        localidad: (address && address.address_localidad) ? String(address.address_localidad) : "",
        barrio: (address && address.address_barrio) ? String(address.address_barrio) : "",
      };
      const mult = getZoneMultiplier(ORIGIN, dest);

      const baseAndreani = randomInRange(2500, 4500);
      const baseCorreo = randomInRange(1800, 3800);
      const baseMoto = randomInRange(3500, 6500);

      let price = 0;
      let carrier = "";
      let detail = "";

      if (shippingMethod === "andreani") {
        carrier = "Andreani";
        price = Math.round(baseAndreani * mult);
        detail = `Envío desde ${ORIGIN.calle} ${ORIGIN.numero}, ${ORIGIN.barrio}, ${ORIGIN.ciudad}`;
      } else if (shippingMethod === "correo") {
        carrier = "Correo Argentino";
        price = Math.round(baseCorreo * mult);
        detail = `Envío desde ${ORIGIN.calle} ${ORIGIN.numero}, ${ORIGIN.barrio}, ${ORIGIN.ciudad}`;
      } else if (shippingMethod === "moto") {
        const uberQuote = Math.round(randomInRange(3000, 6000) * mult);
        const cabifyQuote = Math.round(randomInRange(3200, 6200) * mult);
        price = Math.max(uberQuote, cabifyQuote);
        carrier = "Moto mensajería";
        detail = `Desde ${ORIGIN.calle} ${ORIGIN.numero}, ${ORIGIN.barrio}, ${ORIGIN.ciudad}`;
      }

      res.json({
        shippingMethod,
        carrier,
        price,
        detail,
      });
    } catch (e) {
      console.error("shippingApiController.quote:", e.message);
      res.status(500).json({ message: "Error al cotizar envío", status: 500 });
    }
  },
};

module.exports = shippingApiController;
