import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { Navigate } from "react-router-dom";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { session, isLoading } = useSelector((state: RootState) => state.auth);

  // Mientras estamos averiguando si hay sesión, NO redirigimos
  if (isLoading) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "2rem" }}>
        Cargando sesión...
      </div>
    );
  }

  // Cuando ya sabemos que no hay sesión → a login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Hay sesión → deja pasar
  return <>{children}</>;
};

export default ProtectedRoute;
