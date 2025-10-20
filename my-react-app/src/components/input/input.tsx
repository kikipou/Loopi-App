import "./input.css";
import type { InputProps } from "../../types/inputType";

const Input = ({ 
  placeholder, 
  type = "text", 
  value, 
  onChange, 
  onFocus, 
  onBlur, 
  disabled = false, 
  required = false,
  className = "",
  id,
  name
}: InputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled}
      required={required}
      className={`my-input ${className}`}
      id={id}
      name={name}
    />
  );
};

export default Input;