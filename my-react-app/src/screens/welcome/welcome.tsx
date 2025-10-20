import Button from "../../components/button/button.tsx";
import { useNavigate } from "react-router-dom";
import "./welcome.css";

const Welcome = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate("/register");
  };

  const handleLogIn = () => {
    navigate("/login");
  };

  return (
    <div className="welcome-container">
      {/* Sección Izquierda - Bienvenida y Acciones */}
      <div className="welcome-left">
        <div className="welcome-content">
          <h1 className="welcome-title">Welcome!</h1>
          <p className="welcome-subtitle">Wanna join us? :)</p>
          <p className="welcome-cta">Create an account</p>
          
          <div className="welcome-buttons">
            <Button 
              buttonplaceholder="Sign Up" 
              buttonid="signup-button"
              onClick={handleSignUp}
            />
            <p className="welcome-or">or</p>
            <Button 
              buttonplaceholder="Log In" 
              buttonid="login-button"
              onClick={handleLogIn}
            />
          </div>
        </div>
      </div>

      {/* Sección Derecha - Visual y Branding */}
      <div className="welcome-right">
      </div>
    </div>
  );
};

export default Welcome;
