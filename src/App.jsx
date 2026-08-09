import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { CatalogProvider } from "./context/CatalogContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import WhatsAppFloat from "./components/ui/WhatsAppFloat";
import Toast from "./components/ui/Toast";
import CartDrawer from "./components/cart/CartDrawer";

import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import CombosPage from "./pages/CombosPage";
import ComboDetailPage from "./pages/ComboDetailPage";
import ProductPage from "./pages/ProductPage";
import SearchPage from "./pages/SearchPage";
import ProductsPage from "./pages/ProductsPage";
import EnviosPage from "./pages/EnviosPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminStockPage from "./pages/AdminStockPage";
import AdminStatsPage from "./pages/AdminStatsPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";

function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
      <CatalogProvider>
        <CartProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categoria/:category" element={<CategoryPage />} />
          <Route path="/combos" element={<CombosPage />} />
          <Route path="/combo/:id" element={<ComboDetailPage />} />
          <Route path="/producto/:id" element={<ProductPage />} />
          <Route path="/buscar" element={<SearchPage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/envios" element={<EnviosPage />} />
          <Route
            path="/admin/login"
            element={<AdminLoginPage />}
          />

          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboardPage />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/estadisticas"
            element={
              <ProtectedAdminRoute>
                <AdminStatsPage />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/productos"
            element={
              <ProtectedAdminRoute>
                <AdminProductsPage />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/stock"
            element={
              <ProtectedAdminRoute>
                <AdminStockPage />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/pedidos"
            element={
              <ProtectedAdminRoute>
                <AdminOrdersPage />
              </ProtectedAdminRoute>
            }
          />
        </Routes>

        <Toast />
        <Footer />
        <WhatsAppFloat />
        <CartDrawer />
        </CartProvider>
      </CatalogProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;
