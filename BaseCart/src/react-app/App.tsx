import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "@getmocha/users-service/react";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import { BusinessProvider } from "./context/BusinessContext";
import { StoreCartProvider } from "./context/StoreCartContext";
import { SidebarProvider } from "./context/SidebarContext";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import MenuCategory from "./pages/MenuCategory";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Order from "./pages/Order";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderHistory from "./pages/OrderHistory";
import OrderTrack from "./pages/OrderTrack";
import AdminLogin from "./pages/admin/AdminLogin";
import AuthCallback from "./pages/admin/AuthCallback";
import BusinessOnboarding from "./pages/admin/BusinessOnboarding";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminMenu from "./pages/admin/AdminMenu";
import AdminSettings from "./pages/admin/AdminSettings";
import Storefront from "./pages/Storefront";
import StoreCart from "./pages/StoreCart";
import StoreCheckout from "./pages/StoreCheckout";
import StoreConfirmation from "./pages/StoreConfirmation";
import SystemAdminDashboard from "./pages/system-admin/SystemAdminDashboard";

export default function App() {
  return (
    <AuthProvider>
      <BusinessProvider>
        <ThemeProvider>
          <CartProvider>
            <StoreCartProvider>
              <SidebarProvider>
              <Router>
              <Routes>
                {/* Marketing Website */}
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/menu/:category" element={<MenuCategory />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Customer Ordering (Golden Hour specific) */}
                <Route path="/order" element={<Order />} />
                <Route path="/order/cart" element={<Cart />} />
                <Route path="/order/checkout" element={<Checkout />} />
                <Route path="/order/confirmation" element={<OrderConfirmation />} />
                <Route path="/order/history" element={<OrderHistory />} />
                <Route path="/order/track" element={<OrderTrack />} />
                <Route path="/order/track/:orderNumber" element={<OrderTrack />} />
                
                {/* Public Storefronts (multi-tenant) */}
                <Route path="/store/:slug" element={<Storefront />} />
                <Route path="/store/:slug/cart" element={<StoreCart />} />
                <Route path="/store/:slug/checkout" element={<StoreCheckout />} />
                <Route path="/store/:slug/confirmation" element={<StoreConfirmation />} />
                
                {/* Admin Portal */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/admin/onboarding" element={<BusinessOnboarding />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/menu" element={<AdminMenu />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                
                {/* System Admin */}
                <Route path="/system-admin" element={<SystemAdminDashboard />} />
              </Routes>
            </Router>
              </SidebarProvider>
              </StoreCartProvider>
            </CartProvider>
          </ThemeProvider>
        </BusinessProvider>
      </AuthProvider>
  );
}
