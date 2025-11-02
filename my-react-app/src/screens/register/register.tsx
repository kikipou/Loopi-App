import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button/button";
import Input from "../../components/input/input";
import { supabase } from "../../database/supabaseClient";
import "./register.css";

const Register = () => {
  const navigate = useNavigate();

  // Estados individuales para cada campo
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [validatePassword, setValidatePassword] = useState<boolean>(false);

  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Validar contraseña (mínimo 6 caracteres)
  useEffect(() => {
    setValidatePassword(password.length >= 6);
  }, [password]);

  const handleSignUp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLocalError(null);
    setLoading(true);

    try {
      // Validaciones básicas
      if (!name || !email || !password) {
        setLocalError("Por favor completa todos los campos requeridos");
        setLoading(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setLocalError("Por favor ingresa un email válido");
        setLoading(false);
        return;
      }

      if (!validatePassword) {
        setLocalError("La contraseña debe tener al menos 6 caracteres");
        setLoading(false);
        return;
      }

      // Registro con Supabase
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            username,
            phone,
          },
        },
      });

      if (error) {
        console.error("Error register:", error.message);
        setLocalError(error.message);
        setLoading(false);
        return;
      }

      console.log("registration data:", data);
      console.log("Usuario registrado exitosamente");
      navigate("/login");
    } catch (err) {
      console.error("Error en registro:", err);
      setLocalError(
        err instanceof Error ? err.message : "Error al registrarse"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogIn = () => {
    navigate("/login");
  };

  return (
    <div className="register-container">
      <div className="register-left"></div>

      <div className="register-right">
        <div className="register-form-container">
          <h1 className="register-title">Sign Up</h1>
          <p className="register-subtitle">Let's start your match!</p>

          <form className="register-form" onSubmit={handleSignUp}>
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
                placeholder="Full name"
                type="text"
                value={name}
                onChange={(value: string) => setName(value)}
                required
              />
            </div>

            <div className="form-group">
              <Input
                placeholder="Username"
                type="text"
                value={username}
                onChange={(value: string) => setUsername(value)}
                required
              />
            </div>

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
              <Input
                placeholder="Phone number"
                type="tel"
                value={phone}
                onChange={(value: string) => setPhone(value)}
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
              {!validatePassword && password && (
                <p
                  style={{
                    color: "red",
                    fontSize: "0.9rem",
                    marginTop: "5px",
                  }}
                >
                  La contraseña debe tener al menos 6 caracteres
                </p>
              )}
            </div>

            <div className="form-actions">
              <Button
                buttonplaceholder={loading ? "Registrando..." : "Sign Up"}
                buttonid="signup-button"
                onClick={handleSignUp}
                disabled={loading}
              />
            </div>
          </form>

          <div className="register-login-link">
            <p>¿Already have an account?</p>
            <button className="login-link" onClick={handleLogIn}>
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
