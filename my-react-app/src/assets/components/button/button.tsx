import "./button.css"
import type { ButtonProps }  from "../../types/buttonType.tsx";

const Button = ({ buttonplaceholder, buttonid, onClick }: ButtonProps) => {
  return (
    <button 
      className="my-button" 
      id={buttonid}
      onClick={onClick}
    >
      {buttonplaceholder}
    </button>
  );
};

export default Button;