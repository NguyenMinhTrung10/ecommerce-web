import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingCart, Sun, Moon, Search, User, LogOut, Heart, Compass, X } from 'lucide-react';

const Navbar = ({ onOpenCart, onOpenAuth, searchTerm, setSearchTerm }) => {
  const { user, logoutUser, theme, toggleTheme, cart } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logoutUser();
    setShowProfileMenu(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="nav-logo" onClick={() => setSearchTerm('')}>
          <span className="logo-icon">✨</span>
          <span className="logo-text">CyberStore</span>
        </div>

        {/* Real-time Search Bar */}
        <div className="nav-search-bar">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm công nghệ, thời trang..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="search-clear-btn" onClick={() => setSearchTerm('')}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Actions Menu */}
        <div className="nav-actions">
          {/* Compass / Explore link */}
          <button className="nav-action-btn desktop-only" onClick={() => setSearchTerm('')} title="Khám phá">
            <Compass size={20} />
          </button>

          {/* Favorites (aesthetic detail) */}
          <button className="nav-action-btn desktop-only" title="Yêu thích">
            <Heart size={20} />
          </button>

          {/* Theme Toggle Button */}
          <button className="nav-action-btn theme-toggle-btn" onClick={toggleTheme} title="Đổi giao diện">
            {theme === 'light' ? <Moon size={20} className="moon-glow" /> : <Sun size={20} className="sun-glow" />}
          </button>

          {/* Cart Icon with badge */}
          <button className="nav-action-btn cart-btn" onClick={onOpenCart} title="Giỏ hàng">
            <ShoppingCart size={20} />
            {cartItemsCount > 0 && (
              <span className="cart-badge animate-bounce">{cartItemsCount}</span>
            )}
          </button>

          {/* Authentication Section */}
          {user ? (
            <div className="user-profile-menu-container">
              <button 
                className="user-profile-trigger"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="user-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="user-name-text">{user.username}</span>
              </button>

              {showProfileMenu && (
                <>
                  <div className="menu-backdrop" onClick={() => setShowProfileMenu(false)} />
                  <div className="profile-dropdown-menu">
                    <div className="dropdown-header">
                      <strong>{user.username}</strong>
                      <span>{user.email}</span>
                    </div>
                    <hr />
                    <button className="dropdown-item">
                      <User size={16} />
                      <span>Hồ sơ cá nhân</span>
                    </button>
                    <button className="dropdown-item">
                      <Heart size={16} />
                      <span>Đã yêu thích</span>
                    </button>
                    <hr />
                    <button className="dropdown-item logout-btn" onClick={handleLogout}>
                      <LogOut size={16} />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button className="btn-primary login-trigger-btn" onClick={() => onOpenAuth('login')}>
              <User size={16} />
              <span>Đăng nhập</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
