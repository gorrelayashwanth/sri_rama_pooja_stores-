import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { AnnouncementBar } from "./components/layout/AnnouncementBar";

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
      />
      <StoreInfo />
      <ProductCarousel 
        title="New Arrivals" 
        subtitle="Freshly curated items for your spiritual space"
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
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account/*" element={<AccountPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/orders" replace />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/combos" element={<AdminCombosPage />} />
          <Route path="/admin/reviews" element={<AdminReviewsPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/messages" element={<AdminMessagesPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
          <Route path="/admin/content" element={<AdminContentPage />} />
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
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
