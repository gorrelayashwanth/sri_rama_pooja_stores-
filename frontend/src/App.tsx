import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { SettingsProvider } from "./context/SettingsContext";

import { Footer } from "./components/layout/Footer";
import { AnnouncementBar } from "./components/layout/AnnouncementBar";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdminProtectedRoute } from "./components/auth/AdminProtectedRoute";


import { HeroBanner } from "./components/home/HeroBanner";
import { CategoryGrid } from "./components/home/CategoryGrid";
import { ProductCarousel } from "./components/home/ProductCarousel";
import { OfferStrip } from "./components/home/OfferStrip";
import { StoreInfo } from "./components/home/StoreInfo";
import { LanguageProvider } from "./context/LanguageContext";
import { CollectionsPage } from "./pages/user/CollectionsPage";
import { FestivalsPage } from "./pages/user/FestivalsPage";
import { DeitiesPage } from "./pages/user/DeitiesPage";
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
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";

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
  const isAdminLogin = location.pathname === "/admin/login";

  return (
    <div className={`flex min-h-screen flex-col ${isAdminRoute ? "bg-[#fcfdfc]" : ""}`}>
      {!isAdminRoute && <AnnouncementBar />}
      {(!isAdminRoute || isAdminLogin) && !isAdminLogin && <Navbar />}
      <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/collections/:category" element={<CollectionsPage />} />
            <Route path="/festivals" element={<FestivalsPage />} />
            <Route path="/deities" element={<DeitiesPage />} />
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
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<Navigate to="/admin/orders" replace />} />
            <Route path="/admin/orders" element={<AdminProtectedRoute><AdminOrdersPage /></AdminProtectedRoute>} />
            <Route path="/admin/products" element={<AdminProtectedRoute><AdminProductsPage /></AdminProtectedRoute>} />
            <Route path="/admin/combos" element={<AdminProtectedRoute><AdminCombosPage /></AdminProtectedRoute>} />
            <Route path="/admin/reviews" element={<AdminProtectedRoute><AdminReviewsPage /></AdminProtectedRoute>} />
            <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsersPage /></AdminProtectedRoute>} />
            <Route path="/admin/messages" element={<AdminProtectedRoute><AdminMessagesPage /></AdminProtectedRoute>} />
            <Route path="/admin/settings" element={<AdminProtectedRoute><AdminSettingsPage /></AdminProtectedRoute>} />
            <Route path="/admin/content" element={<AdminProtectedRoute><AdminContentPage /></AdminProtectedRoute>} />
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
        <LanguageProvider>
          <AppShell />
        </LanguageProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
}


export default App;
