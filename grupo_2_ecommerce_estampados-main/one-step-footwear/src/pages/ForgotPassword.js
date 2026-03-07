import { useState } from "react";
import { Link } from "react-router-dom";
import { API_USERS } from "../config";
import "./login.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${API_USERS}/forgot-password`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setSuccess(data.message || "Revisá tu correo para restablecer la contraseña.");
      } else {
        setError(data.message || "Ocurrió un error. Intentá de nuevo.");
      }
    } catch (err) {
      console.error("Error recupero contraseña:", err);
      setError("Error de conexión. Revisá que el backend esté en marcha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">RECUPERAR CONTRASEÑA</h2>
        <p className="forgot-text">
          Ingresá el correo electrónico de tu cuenta y te enviaremos instrucciones para restablecer tu contraseña.
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {error && (
            <p className="error" style={{ color: "red", marginBottom: "10px" }}>
              {error}
            </p>
          )}
          {success && (
            <p className="success" style={{ color: "#4ade80", marginBottom: "10px" }}>
              {success}
            </p>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Enviando..." : "ENVIAR INSTRUCCIONES"}
          </button>
        </form>

        <p className="register-link">
          <Link to="/login">Volver al inicio de sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
