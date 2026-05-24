import React, { useState, useRef, lazy, Suspense } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProductList from './features/products/components/ProductList';
import ToastContainer from './components/Toast';
import { products } from './data/products';
import './App.css';

// Senior Optimization: Lazy Load heavy modal/drawer components
const CartDrawer = lazy(() => import('./features/cart/components/CartDrawer'));
const ProductDetails = lazy(() => import('./features/products/components/ProductDetails'));
const AuthModal = lazy(() => import('./features/auth/components/AuthModal'));
const CheckoutModal = lazy(() => import('./features/cart/components/CheckoutModal'));

function AppContent() {
  const { theme } = useApp();
  
  // Modal & Sidebar states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState('login');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Checkout Modal states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    finalTotal: 0,
    promoDiscount: 0,
    currentPromoCode: ''
  });

  // Search input state
  const [searchTerm, setSearchTerm] = useState('');

  // Scroll reference for Hero button
  const catalogRef = useRef(null);

  const scrollToCatalog = () => {
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAuth = (tab = 'login') => {
    setAuthInitialTab(tab);
    setIsAuthOpen(true);
  };

  const handleOpenDetails = (product) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  const handleOpenCheckout = (data) => {
    setCheckoutData(data);
    setIsCartOpen(false); // Close cart drawer
    setIsCheckoutOpen(true); // Open checkout modal
  };

  return (
    <div className={`app-container ${theme}`}>
      {/* Navigation */}
      <Navbar 
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={handleOpenAuth}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <main className="main-content-layout">
        {/* Banner Hero */}
        <HeroSection scrollToProducts={scrollToCatalog} />

        {/* Catalog */}
        <div ref={catalogRef} className="container-width">
          <ProductList 
            products={products}
            onViewDetails={handleOpenDetails}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
      </main>

      {/* Footer Section */}
      <footer className="footer-section">
        <div className="container-width">
          <div className="footer-grid">
            <div className="footer-col">
              <h4 className="logo-text">CyberStore</h4>
              <p>Hệ sinh thái mua sắm công nghệ và thời trang cao cấp hàng đầu Việt Nam. Tận hưởng chất lượng dịch vụ chuẩn 5 sao.</p>
            </div>
            <div className="footer-col">
              <h4>Mua sắm</h4>
              <ul className="footer-links">
                <li>Thiết bị công nghệ</li>
                <li>Thời trang nam/nữ</li>
                <li>Phụ kiện hàng hiệu</li>
                <li>Trang trí phong cách</li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Hỗ trợ khách hàng</h4>
              <ul className="footer-links">
                <li>Chính sách bảo hành</li>
                <li>Chính sách vận chuyển</li>
                <li>Quy định đổi trả hàng</li>
                <li>Câu hỏi thường gặp FAQ</li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Đăng ký nhận ưu đãi</h4>
              <p>Cập nhật những xu hướng công nghệ mới nhất và nhận voucher giảm giá 10% cho đơn hàng đầu tiên.</p>
              <div className="footer-newsletter-form">
                <input type="email" placeholder="Email của bạn" />
                <button className="btn-primary" onClick={() => alert('Cảm ơn bạn đã đăng ký nhận tin!')}>Gửi</button>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 CyberStore. Thiết kế bởi Antigravity. Tất cả các quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      <ToastContainer />

      {/* -------------------- OVERLAYS, DRAWERS, MODALS (LAZY LOADED) -------------------- */}
      <Suspense fallback={null}>
        {isCartOpen && (
          <CartDrawer 
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            onOpenCheckout={handleOpenCheckout}
            onOpenAuth={() => handleOpenAuth('login')}
          />
        )}

        {isDetailsOpen && selectedProduct && (
          <ProductDetails 
            product={selectedProduct}
            isOpen={isDetailsOpen}
            onClose={() => {
              setIsDetailsOpen(false);
              setSelectedProduct(null);
            }}
          />
        )}

        {isAuthOpen && (
          <AuthModal 
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            initialTab={authInitialTab}
          />
        )}

        {isCheckoutOpen && (
          <CheckoutModal 
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            finalTotal={checkoutData.finalTotal}
            promoDiscount={checkoutData.promoDiscount}
            currentPromoCode={checkoutData.currentPromoCode}
          />
        )}
      </Suspense>
    </div>
  );
}

// Main App wrapping inside Provider
function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
