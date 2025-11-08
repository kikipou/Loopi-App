import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { Navigate } from "react-router-dom";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { session, isLoading } = useSelector((state: RootState) => state.auth);

  if (isLoading) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "2rem" }}>
        Cargando sesión...
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
