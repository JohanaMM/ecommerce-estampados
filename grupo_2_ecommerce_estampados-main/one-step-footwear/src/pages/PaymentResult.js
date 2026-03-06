import React from "react";
import { Link } from "react-router-dom";

const styles = {
  page: {
    minHeight: "60vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    textAlign: "center"
  },
  title: { marginBottom: "1rem", fontSize: "1.5rem" },
  text: { marginBottom: "1.5rem", color: "#555" },
  link: {
    display: "inline-block",
    padding: "0.75rem 1.5rem",
    background: "#333",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "6px"
  }
};

export function PaymentSuccess() {
  return (
    <div style={styles.page}>
      <h1 style={{ ...styles.title, color: "#2e7d32" }}>¡Pago aprobado!</h1>
      <p style={styles.text}>Tu pedido fue procesado correctamente.</p>
      <Link to="/" style={styles.link}>Volver al inicio</Link>
      <Link to="/product-list" style={{ ...styles.link, marginLeft: "1rem", background: "#1976d2" }}>
        Seguir comprando
      </Link>
    </div>
  );
}

export function PaymentFailure() {
  return (
    <div style={styles.page}>
      <h1 style={{ ...styles.title, color: "#c62828" }}>Pago rechazado</h1>
      <p style={styles.text}>No se pudo completar el pago. Puedes intentar de nuevo desde el carrito.</p>
      <Link to="/carrito" style={styles.link}>Volver al carrito</Link>
      <Link to="/" style={{ ...styles.link, marginLeft: "1rem", background: "#1976d2" }}>
        Ir al inicio
      </Link>
    </div>
  );
}

export function PaymentPending() {
  return (
    <div style={styles.page}>
      <h1 style={{ ...styles.title, color: "#ed6c02" }}>Pago pendiente</h1>
      <p style={styles.text}>Tu pago está en proceso. Te avisaremos cuando se confirme.</p>
      <Link to="/" style={styles.link}>Volver al inicio</Link>
    </div>
  );
}
