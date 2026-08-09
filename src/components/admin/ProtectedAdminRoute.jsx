import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

function ProtectedAdminRoute({ children }) {
  const {
    admin,
    loadingAdmin,
  } = useAdminAuth();

  if (loadingAdmin) {
    return null;
  }

  if (!admin) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return children;
}

export default ProtectedAdminRoute;
