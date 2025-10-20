import "./button.css"
import type { ButtonProps }  from "../../types/buttonType.tsx";

const Button = ({ buttonplaceholder, buttonid, onClick, disabled = false }: ButtonProps) => {
  return (
    <button 
      className="my-button" 
      id={buttonid}
      onClick={onClick}
      disabled={disabled}
    >
      {buttonplaceholder}
    </button>
  );
};

export default Button;