import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button/button";
import Input from "../../components/input/input";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogIn = () => {
    console.log("Log In data:", formData);
    navigate("/home");
  };

  const handleSignUp = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <div className="login-left">
      </div>

      <div className="login-right">
        <div className="login-form-container">
          <h1 className="login-title">Log In</h1>
          <p className="login-subtitle">Keep matching!</p>
          
          <form className="login-form">
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
                buttonplaceholder="Log In"
                buttonid="login-button"
                onClick={handleLogIn}
              />
            </div>
          </form>
          
          <div className="login-signup-link">
            <p>Don't have an account?</p>
            <button 
              className="signup-link"
              onClick={handleSignUp}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;