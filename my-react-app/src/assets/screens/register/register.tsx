import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button/button";
import Input from "../../components/input/input";
import "./register.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignUp = () => {
    // Aquí irá la lógica de registro
    console.log("Sign Up data:", formData);
    // Por ahora redirigimos al home
    navigate("/home");
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
            <div className="form-group">
              <Input
                placeholder="Full name"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange("fullName")}
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
                buttonplaceholder="Sign Up"
                buttonid="signup-button"
                onClick={handleSignUp}
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