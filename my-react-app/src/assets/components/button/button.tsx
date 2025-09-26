import "./button.css"
import type { ButtonProps }  from "../../types/buttonType.tsx";

const Button = ({ buttonplaceholder }: ButtonProps) => {
  return <button className="my-button">{buttonplaceholder}</button>;
};

export default Button;