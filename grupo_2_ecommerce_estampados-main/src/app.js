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

// Middlewares
const remindMeCookie = require("./middlewares/remindMeCookie");

const app = express();
const PORT = process.env.PORT || 3000;
const publicPath = path.resolve(__dirname, "../public");

// ==========================
// CONFIGURACIÓN DE CORS (SOLUCIÓN DEFINITIVA)
// ==========================
app.use(cors({
  origin: function (origin, callback) {
    // Permite peticiones sin origen (como Postman) o desde localhost/127.0.0.1
    if (!origin || origin.includes("localhost") || origin.includes("127.0.0.1")) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"]
}));

// Responder a peticiones preflight (obligatorio para navegadores modernos)
app.options('*', cors());

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
app.use(contactRouter);

// ==========================
// INICIO DEL SERVIDOR
// ==========================
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`✅ CORS configurado para aceptar peticiones de React`);
});