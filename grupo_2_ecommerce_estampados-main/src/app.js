// ==========================
// IMPORTACIONES
// ==========================
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Routers
const mainRouter = require("./routers/mainRouter");
const contactRouter = require("./routers/contactRouter");
const usersApiRouter = require("./routers/API/usersApiRouter");
const productsApiRouter = require("./routers/API/productsApiRouter");
const paymentsApiRouter = require("./routers/API/paymentsApiRouter");
const shippingApiRouter = require("./routers/API/shippingApiRouter");
const ordersApiRouter = require("./routers/API/ordersApiRouter");
const adminApiRouter = require("./routers/API/adminApiRouter");

// Middlewares
const remindMeCookie = require("./middlewares/remindMeCookie");

const app = express();
const PORT = process.env.PORT || 3000;
const publicPath = path.resolve(__dirname, "../public");

// ==========================
// CORS – debe ser lo primero
// ==========================
const corsOptions = {
  origin: (origin, callback) => {
    const ok = !origin || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    callback(ok ? null : new Error("CORS no permitido"), ok ? origin || true : false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Admin-Key"],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ==========================
// OTROS MIDDLEWARES
// ==========================
app.use(express.static(publicPath));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method"));

// Configuración de Sesiones
app.use(
  session({
    secret: "la clave es secreta",
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // false para desarrollo local
        httpOnly: true 
    }
  })
);

app.use(cookieParser());
app.use(remindMeCookie);

// ==========================
// CONFIGURACIÓN DE VISTAS (EJS)
// ==========================
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

// ==========================
// RUTAS
// ==========================
app.use("/", mainRouter);
app.use("/api/users", usersApiRouter);
app.use("/api/products", productsApiRouter);
app.use("/api/payments", paymentsApiRouter);
app.use("/api/shipping", shippingApiRouter);
app.use("/api/orders", ordersApiRouter);
app.use("/api/admin", adminApiRouter);
app.use(contactRouter);

// ==========================
// COLUMNAS OPCIONALES (products: theme, color | orders: shipping_status)
// Si no existen, las crea al iniciar. No necesitás ejecutar MySQL a mano.
// ==========================
const db = require("./database/models");
const ensureColumns = () =>
  Promise.all([
    db.sequelize.query("ALTER TABLE products ADD COLUMN theme VARCHAR(60) NULL DEFAULT NULL").catch(() => {}),
    db.sequelize.query("ALTER TABLE products ADD COLUMN color VARCHAR(60) NULL DEFAULT NULL").catch(() => {}),
    db.sequelize.query("ALTER TABLE orders ADD COLUMN shipping_status VARCHAR(30) NULL DEFAULT NULL").catch(() => {}),
  ]);

// ==========================
// INICIO DEL SERVIDOR
// ==========================
ensureColumns().then(
  () => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
      console.log(`✅ CORS configurado para aceptar peticiones de React`);
    });
  },
  () => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
      console.log(`✅ CORS configurado para aceptar peticiones de React`);
    });
  }
);