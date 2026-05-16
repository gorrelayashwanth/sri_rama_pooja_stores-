import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { SettingsProvider } from "./context/SettingsContext";

import { Footer } from "./components/layout/Footer";
import { AnnouncementBar } from "./components/layout/AnnouncementBar";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";


import { HeroBanner } from "./components/home/HeroBanner";
import { CategoryGrid } from "./components/home/CategoryGrid";
import { ProductCarousel } from "./components/home/ProductCarousel";
import { OfferStrip } from "./components/home/OfferStrip";
import { StoreInfo } from "./components/home/StoreInfo";
import { CollectionsPage } from "./pages/user/CollectionsPage";
import { ProductDetailPage } from "./pages/user/ProductDetailPage";
import { CartPage } from "./pages/user/CartPage";
import { LoginPage } from "./pages/user/LoginPage";
import { RegisterPage } from "./pages/user/RegisterPage";
import { CheckoutPage } from "./pages/user/CheckoutPage";
import { AccountPage } from "./pages/user/AccountPage";
import { AboutPage } from "./pages/user/AboutPage";
import { ContactPage } from "./pages/user/ContactPage";
import { WishlistPage } from "./pages/user/WishlistPage";
import { AdminOrdersPage } from "./pages/admin/AdminOrdersPage";
import { AdminCombosPage } from "./pages/admin/AdminCombosPage";
import { AdminProductsPage } from "./pages/admin/AdminProductsPage";
import { AdminMessagesPage } from "./pages/admin/AdminMessagesPage";
import { AdminReviewsPage } from "./pages/admin/AdminReviewsPage";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { AdminSettingsPage } from "./pages/admin/AdminSettingsPage";
import { AdminContentPage } from "./pages/admin/AdminContentPage";

function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroBanner />
      <CategoryGrid />
      <OfferStrip />
      <ProductCarousel 
        title="Bestselling Items" 
        subtitle="Most loved by our community of devotees"
        type="bestselling"
      />
      <StoreInfo />
      <ProductCarousel 
        title="New Arrivals" 
        subtitle="Freshly curated items for your spiritual space"
        type="newest"
      />
    </div>
  );
}


function AppShell() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className={`flex min-h-screen flex-col ${isAdminRoute ? "bg-[#fcfdfc]" : ""}`}>
      {!isAdminRoute && <AnnouncementBar />}
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:category" element={<CollectionsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account/*" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/orders" replace />} />
          <Route path="/admin/orders" element={<ProtectedRoute requireAdmin><AdminOrdersPage /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute requireAdmin><AdminProductsPage /></ProtectedRoute>} />
          <Route path="/admin/combos" element={<ProtectedRoute requireAdmin><AdminCombosPage /></ProtectedRoute>} />
          <Route path="/admin/reviews" element={<ProtectedRoute requireAdmin><AdminReviewsPage /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute requireAdmin><AdminUsersPage /></ProtectedRoute>} />
          <Route path="/admin/messages" element={<ProtectedRoute requireAdmin><AdminMessagesPage /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><AdminSettingsPage /></ProtectedRoute>} />
          <Route path="/admin/content" element={<ProtectedRoute requireAdmin><AdminContentPage /></ProtectedRoute>} />
          <Route path="/admin/*" element={<Navigate to="/admin/orders" replace />} />

        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <AppShell />
      </SettingsProvider>
    </BrowserRouter>
  );
}


export default App;
