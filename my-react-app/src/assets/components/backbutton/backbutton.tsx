import "./backbutton.css"
import { useNavigate } from "react-router-dom";

const BackButton = () => {
    const navigate = useNavigate();
    const handleComeBack = () => {
        navigate("/home");
      };

  return (
    <button 
      className="back-button" 
      onClick={handleComeBack}
    >
    </button>
  );
};

export default BackButton;