import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button/button";
import Input from "../../components/input/input";
import { supabase } from "../../database/supabaseClient";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLocalError(null);
    setLoading(true);

    try {
      if (!email || !password) {
        setLocalError("Por favor completa todos los campos");
        setLoading(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setLocalError("Por favor ingresa un email válido");
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Error login:", error.message);
        setLocalError("Correo o contraseña incorrectos");
        setLoading(false);
        return;
      }

      console.log("Sesión iniciada exitosamente");
      navigate("/home");
    } catch (err) {
      console.error("Error en login:", err);
      setLocalError(
        err instanceof Error ? err.message : "Error al iniciar sesión"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <div className="login-left"></div>
      <div className="login-right">
        <div className="login-form-container">
          <h1 className="login-title">Log In</h1>
          <p className="login-subtitle">Keep matching!</p>

          <form className="login-form" onSubmit={handleLogIn}>
            {localError && (
              <div
                className="error-message"
                style={{
                  color: "red",
                  backgroundColor: "#ffe6e6",
                  padding: "10px",
                  borderRadius: "5px",
                  marginBottom: "15px",
                  border: "1px solid #ff9999",
                }}
              >
                {localError}
              </div>
            )}

            <div className="form-group">
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(value: string) => setEmail(value)}
                required
              />
            </div>

            <div className="form-group">
              <div className="password-input-container">
                <Input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(value: string) => setPassword(value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <div className="form-actions">
              <Button
                buttonid="login-button"
                onClick={handleLogIn}
                disabled={loading}
                buttonplaceholder={loading ? "Iniciando sesión..." : "Log In"}
              />
            </div>
          </form>

          <div className="login-signup-link">
            <p>Don't have an account?</p>
            <button className="signup-link" onClick={handleSignUp}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
