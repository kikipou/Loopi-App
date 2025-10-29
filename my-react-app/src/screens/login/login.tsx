// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Button from "../../components/button/button";
// import Input from "../../components/input/input";
// import { useAuth } from "../../../contexts/authContext";
import "./login.css";

const Login = () => {
  // const navigate = useNavigate();
  // // const { signIn, loading, error } = useAuth();
  // const [formData, setFormData] = useState({
  //   email: "",
  //   password: "",
  // });
  // const [showPassword, setShowPassword] = useState(false);
  // const [localError, setLocalError] = useState<string | null>(null);
  // const handleInputChange = (field: string) => (value: string) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     [field]: value,
  //   }));
  // };
  // const handleLogIn = async () => {
  //   try {
  //     setLocalError(null);
  //     // Validar campos requeridos
  //     if (!formData.email || !formData.password) {
  //       setLocalError("Por favor completa todos los campos");
  //       return;
  //     }
  //     // Validar email
  //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //     if (!emailRegex.test(formData.email)) {
  //       setLocalError("Por favor ingresa un email válido");
  //       return;
  //     }
  //     console.log("Intentando iniciar sesión:", formData);
  //     // await signIn(formData.email, formData.password);
  //     console.log("Sesión iniciada exitosamente");
  //     navigate("/home");
  //   } catch (err) {
  //     console.error("Error en login:", err);
  //     setLocalError(
  //       err instanceof Error ? err.message : "Error al iniciar sesión"
  //     );
  //   }
  // };
  // const handleSignUp = () => {
  //   navigate("/register");
  // };
  // return (
  //   <div className="login-container">
  //     <div className="login-left"></div>
  //     <div className="login-right">
  //       <div className="login-form-container">
  //         <h1 className="login-title">Log In</h1>
  //         <p className="login-subtitle">Keep matching!</p>
  //         <form className="login-form">
  //           {/* {(error || localError) && ( */}
  //             <div
  //               className="error-message"
  //               style={{
  //                 color: "red",
  //                 backgroundColor: "#ffe6e6",
  //                 padding: "10px",
  //                 borderRadius: "5px",
  //                 marginBottom: "15px",
  //                 border: "1px solid #ff9999",
  //               }}
  //             >
  //               {error || localError}
  //             </div>
  //           )}
  //           <div className="form-group">
  //             <Input
  //               placeholder="Email"
  //               type="email"
  //               value={formData.email}
  //               onChange={handleInputChange("email")}
  //               required
  //             />
  //           </div>
  //           <div className="form-group">
  //             <div className="password-input-container">
  //               <Input
  //                 placeholder="Password"
  //                 type={showPassword ? "text" : "password"}
  //                 value={formData.password}
  //                 onChange={handleInputChange("password")}
  //                 required
  //               />
  //               <button
  //                 type="button"
  //                 className="password-toggle"
  //                 onClick={() => setShowPassword(!showPassword)}
  //               >
  //                 {showPassword ? "👁️" : "👁️‍🗨️"}
  //               </button>
  //             </div>
  //           </div>
  //           <div className="form-actions">
  //             <Button
  //               // buttonplaceholder={loading ? "Iniciando sesión..." : "Log In"}
  //               buttonid="login-button"
  //               onClick={handleLogIn}
  //               disabled={loading}
  //             />
  //           </div>
  //         </form>
  //         <div className="login-signup-link">
  //           <p>Don't have an account?</p>
  //           <button className="signup-link" onClick={handleSignUp}>
  //             Sign Up
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default Login;
