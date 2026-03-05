import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom"; // Añadimos useLocation
import "./login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation(); // <--- Capturamos la ubicación actual

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        credentials: "include", 
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        const userData = data.user || data.data || data;
        
        if (remember) {
          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          sessionStorage.setItem("user", JSON.stringify(userData));
        }

        // --- LÓGICA DE REDIRECCIÓN INTELIGENTE ---
        // Si venimos de Personaliza (o cualquier otra página), location.state.from tendrá esa ruta.
        const from = location.state?.from || "/perfil";
        navigate(from);

      } else {
        setError(data.message || "Credenciales inválidas");
      }

    } catch (err) {
      console.error("Error en login:", err);
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">INICIAR SESIÓN</h2>

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="remember">
            <input
              type="checkbox"
              id="remember-check"
              checked={remember}
              onChange={() => setRemember(!remember)}
            />
            <label htmlFor="remember-check">Recordarme</label>
          </div>

          {error && <p className="error" style={{color: 'red', marginBottom: '10px'}}>{error}</p>}

          <button type="submit" className="login-btn">
            INGRESAR
          </button>
        </form>

        <p className="register-link">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>

        <p className="forgot-link">
          <Link to="/forgot-password">Olvidé mi contraseña</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;