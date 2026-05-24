import React from 'react';
import { Sparkles, ShoppingBag, ShieldCheck, Flame } from 'lucide-react';

const HeroSection = ({ scrollToProducts }) => {
  return (
    <header className="hero-section">
      <div className="container-width">
        <div className="hero-grid">
          {/* Hero Left Content */}
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={14} className="badge-spark" />
              <span>Thế hệ mua sắm thông minh mới 2026</span>
            </div>
            
            <h1 className="hero-title">
              Trải Nghiệm Không Gian <br />
              <span className="text-gradient">Mua Sắm Tương Lai</span>
            </h1>
            
            <p className="hero-description">
              Chào mừng bạn đến với CyberStore - hệ sinh thái bán lẻ công nghệ, phụ kiện cao cấp và đồ decor độc đáo. Khám phá những sản phẩm mang xu hướng thời đại với chính sách bảo hành 1-đổi-1 toàn diện.
            </p>

            <div className="hero-actions">
              <button className="btn-primary hero-btn glow-effect" onClick={scrollToProducts}>
                <ShoppingBag size={18} />
                <span>Mua sắm ngay</span>
              </button>
              <button className="btn-secondary hero-btn" onClick={scrollToProducts}>
                <span>Khám phá bộ sưu tập</span>
              </button>
            </div>

            {/* Core Trust Indicators */}
            <div className="hero-features">
              <div className="feature-item">
                <ShieldCheck size={18} className="feat-icon" />
                <span>100% Chính hãng</span>
              </div>
              <div className="feature-item">
                <Flame size={18} className="feat-icon" />
                <span>Freeship từ 1.5M</span>
              </div>
            </div>
          </div>

          {/* Hero Right Decorative Visual */}
          <div className="hero-visual">
            <div className="visual-glow-orange" />
            <div className="visual-glow-purple" />
            
            {/* Main Floating Neon Card */}
            <div className="floating-card glassmorphism">
              <div className="floating-card-header">
                <div className="status-indicator">
                  <span className="pulse-dot" />
                  <span>Đang Hot</span>
                </div>
                <span className="price-tag">GIẢM 20%</span>
              </div>
              
              <img 
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80" 
                alt="Featured Item" 
                className="featured-float-img"
              />
              
              <div className="floating-card-body">
                <h4>AuraSound Max Hybrid ANC</h4>
                <p>Trải nghiệm âm thanh đỉnh cao chống ồn chủ động vượt trội.</p>
                <div className="card-footer-price">
                  <span className="old-price">4.290.000 ₫</span>
                  <span className="new-price">3.490.000 ₫</span>
                </div>
              </div>
            </div>

            {/* Small companion decorative circle/dots */}
            <div className="deco-sphere sphere-1" />
            <div className="deco-sphere sphere-2" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
