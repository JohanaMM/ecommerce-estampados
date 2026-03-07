import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { API_USERS } from "../config";
import "./login.css";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Falta el enlace de recupero. Solicitá uno nuevo desde «Olvidé mi contraseña».");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_USERS}/reset-password`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setSuccess(data.message || "Contraseña actualizada.");
        setTimeout(() => navigate("/login"), 2500);
      } else {
        setError(data.message || "No se pudo actualizar la contraseña.");
      }
    } catch (err) {
      console.error("Error reset password:", err);
      setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h2 className="login-title">RESTABLECER CONTRASEÑA</h2>
          <p className="forgot-text">
            Este enlace no es válido o ya expiró. Solicitá uno nuevo desde la página de recupero.
          </p>
          <p className="register-link">
            <Link to="/forgot-password">Solicitar nuevo enlace</Link>
          </p>
          <p className="register-link">
            <Link to="/login">Volver al inicio de sesión</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">NUEVA CONTRASEÑA</h2>
        <p className="forgot-text">
          Ingresá tu nueva contraseña (mínimo 6 caracteres).
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Guardando..." : "RESTABLECER CONTRASEÑA"}
          </button>
        </form>

        <p className="register-link">
          <Link to="/login">Volver al inicio de sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
