import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentAdmin,
  loginAdmin,
  logoutAdmin,
} from "../services/adminAuthApi";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loadingAdmin, setLoadingAdmin] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const currentAdmin =
          await getCurrentAdmin();

        setAdmin(currentAdmin);
      } catch {
        setAdmin(null);
      } finally {
        setLoadingAdmin(false);
      }
    }

    checkSession();
  }, []);

  const login = async (email, password) => {
    const loggedAdmin =
      await loginAdmin(email, password);

    setAdmin(loggedAdmin);

    return loggedAdmin;
  };

  const logout = async () => {
    try {
      await logoutAdmin();
    } finally {
      setAdmin(null);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        loadingAdmin,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error(
      "useAdminAuth debe utilizarse dentro de AdminAuthProvider"
    );
  }

  return context;
}
