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
        <img className="back-icon" src="https://github.com/kikipou/Loopi-App/blob/cata/my-react-app/src/assets/imgs/back.png?raw=true" alt="back-button" />
    </button>
  );
};

export default BackButton;