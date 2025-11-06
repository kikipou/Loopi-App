import { useSelector } from "react-redux";
import type { RootState } from "../redux/store"; // asegúrate de que esta ruta sea la correcta
import { Navigate } from "react-router-dom";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const session = useSelector((state: RootState) => state.auth.session);

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
