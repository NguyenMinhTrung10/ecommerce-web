import React, { createContext, useState, useEffect, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { storage } from '../services/storage';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // Theme state synced with localStorage
  const [theme, setTheme] = useLocalStorage('themePreference', () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // User state synced with localStorage
  const [user, setUser] = useLocalStorage('currentUser', null);

  // Cart state synced with localStorage
  const [cart, setCart] = useLocalStorage('cartItems', []);

  // Toast state (in-memory only)
  const [toasts, setToasts] = useState([]);

  // Apply theme class to document html tag
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.className = theme;
  }, [theme]);

  // Toggle Theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Toast functions
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Cart actions
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        const newQty = existingItem.quantity + quantity;
        if (newQty > product.inStock) {
          showToast(`Chỉ còn lại ${product.inStock} sản phẩm trong kho!`, 'warning');
          return prevCart;
        }
        showToast(`Đã cập nhật số lượng ${product.name} trong giỏ hàng!`, 'success');
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        if (quantity > product.inStock) {
          showToast(`Chỉ còn lại ${product.inStock} sản phẩm trong kho!`, 'warning');
          return prevCart;
        }
        showToast(`Đã thêm ${product.name} vào giỏ hàng!`, 'success');
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    const item = cart.find(i => i.id === productId);
    setCart(prev => prev.filter(item => item.id !== productId));
    if (item) {
      showToast(`Đã xóa ${item.name} khỏi giỏ hàng`, 'info');
    }
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    const item = cart.find(i => i.id === productId);
    if (item && newQty > item.inStock) {
      showToast(`Rất tiếc, chỉ còn ${item.inStock} sản phẩm trong kho`, 'warning');
      return;
    }
    setCart(prev => prev.map(item =>
      item.id === productId ? { ...item, quantity: newQty } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Authentication actions
  const registerUser = (username, email, password) => {
    const users = storage.safeGet('registeredUsers', []);
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      showToast('Email này đã được đăng ký!', 'error');
      return false;
    }
    
    const newUser = { username, email, password };
    users.push(newUser);
    storage.safeSet('registeredUsers', users);
    showToast('Đăng ký tài khoản thành công! Hãy đăng nhập.', 'success');
    return true;
  };

  const loginUser = (email, password) => {
    const users = storage.safeGet('registeredUsers', []);
    const matchedUser = users.find(u => u.email === email && u.password === password);
    
    if (matchedUser) {
      const userSession = { username: matchedUser.username, email: matchedUser.email };
      setUser(userSession);
      showToast(`Chào mừng quay trở lại, ${matchedUser.username}!`, 'success');
      return true;
    } else {
      showToast('Email hoặc mật khẩu không chính xác!', 'error');
      return false;
    }
  };

  const logoutUser = () => {
    setUser(null);
    showToast('Đã đăng xuất tài khoản', 'info');
  };

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      user, loginUser, registerUser, logoutUser,
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      toasts, showToast, removeToast
    }}>
      {children}
    </AppContext.Provider>
  );
};
