import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button/button";
import Input from "../../components/input/input";
import { useAuth } from "../../../contexts/authContext";
import "./register.css";

const Register = () => {
  const navigate = useNavigate();
  const { signUp, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);


  const handleInputChange = (field: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignUp = async () => {
    try {
      setLocalError(null);
      
      // Validar campos requeridos
      if (!formData.name || !formData.email || !formData.password) {
        setLocalError("Por favor completa todos los campos requeridos");
        return;
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setLocalError("Por favor ingresa un email válido");
        return;
      }

      // Validar contraseña
      if (formData.password.length < 6) {
        setLocalError("La contraseña debe tener al menos 6 caracteres");
        return;
      }

      console.log("Intentando registrar usuario:", formData);
      
      await signUp(formData.email, formData.password, formData.name, formData.username, formData.phone);
      
      console.log("Usuario registrado exitosamente");
      navigate("/home");
    } catch (err) {
      console.error("Error en registro:", err);
      setLocalError(err instanceof Error ? err.message : "Error al registrarse");
    }
  };

  const handleLogIn = () => {
    navigate("/login");
  };

  return (
    <div className="register-container">
      {/* Sección Izquierda - Imagen y Branding */}
      <div className="register-left">
      </div>

      {/* Sección Derecha - Formulario de Registro */}
      <div className="register-right">
        <div className="register-form-container">
          <h1 className="register-title">Sign Up</h1>
          <p className="register-subtitle">Let's start your match!</p>
          
          <form className="register-form">
            {/* Mostrar errores */}
            {(error || localError) && (
              <div className="error-message" style={{ 
                color: 'red', 
                backgroundColor: '#ffe6e6', 
                padding: '10px', 
                borderRadius: '5px', 
                marginBottom: '15px',
                border: '1px solid #ff9999'
              }}>
                {error || localError}
              </div>
            )}
            
            <div className="form-group">
              <Input
                placeholder="Full name"
                type="text"
                value={formData.name}
                onChange={handleInputChange("name")}
                required
              />
            </div>
            
            <div className="form-group">
              <Input
                placeholder="Username"
                type="text"
                value={formData.username}
                onChange={handleInputChange("username")}
                required
              />
            </div>
            
            <div className="form-group">
              <Input
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                required
              />
            </div>
            
            <div className="form-group">
              <Input
                placeholder="Phone number"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange("phone")}
                required
              />
            </div>
            
            <div className="form-group">
              <div className="password-input-container">
                <Input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange("password")}
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
                buttonplaceholder={loading ? "Registrando..." : "Sign Up"}
                buttonid="signup-button"
                onClick={handleSignUp}
                disabled={loading}
              />
            </div>
          </form>
          
          <div className="register-login-link">
            <p>¿Already have an account?</p>
            <button 
              className="login-link"
              onClick={handleLogIn}
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;