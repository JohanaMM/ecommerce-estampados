import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_USERS } from "../config";
import "./login.css";

function Register() {
  const navigate = useNavigate();
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      const response = await fetch(`${API_USERS}/register`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          first_name: first_name.trim(),
          last_name: last_name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setSuccess(data.message || "Cuenta creada. Redirigiendo al login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.message || "Error al crear la cuenta.");
      }
    } catch (err) {
      console.error("Error en registro:", err);
      setError("Error de conexión. Revisá que el backend esté en marcha.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">CREAR CUENTA</h2>

        <form onSubmit={handleRegister} className="login-form">
          <input
            type="text"
            placeholder="Nombre"
            value={first_name}
            onChange={(e) => setFirst_name(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Apellido"
            value={last_name}
            onChange={(e) => setLast_name(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña (mín. 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

          <button type="submit" className="login-btn">
            REGISTRARME
          </button>
        </form>

        <p className="register-link">
          ¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
