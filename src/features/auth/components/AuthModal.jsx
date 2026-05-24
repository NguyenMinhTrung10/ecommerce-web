import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, initialTab = 'login' }) => {
  const { loginUser, registerUser } = useApp();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setError('');
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'login') {
      if (!email || !password) {
        setError('Vui lòng điền đầy đủ tất cả các trường.');
        return;
      }
      const success = loginUser(email, password);
      if (success) {
        onClose();
      }
    } else {
      if (!username || !email || !password || !confirmPassword) {
        setError('Vui lòng điền đầy đủ tất cả các trường.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Mật khẩu xác nhận không khớp!');
        return;
      }
      if (password.length < 6) {
        setError('Mật khẩu phải có ít nhất 6 ký tự.');
        return;
      }
      
      const success = registerUser(username, email, password);
      if (success) {
        setActiveTab('login');
        setPassword('');
        setConfirmPassword('');
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="auth-tabs">
          <button 
            className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => { setActiveTab('login'); setError(''); }}
          >
            Đăng nhập
          </button>
          <button 
            className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => { setActiveTab('register'); setError(''); }}
          >
            Đăng ký
          </button>
          <div className={`auth-tab-indicator ${activeTab === 'register' ? 'shift' : ''}`} />
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error-msg">{error}</div>}

          {activeTab === 'register' && (
            <div className="input-group">
              <label htmlFor="reg-name">Tên hiển thị</label>
              <div className="input-field-wrap">
                <User className="input-icon" size={18} />
                <input 
                  type="text" 
                  id="reg-name" 
                  placeholder="Nguyễn Văn A" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <label htmlFor="auth-email">Địa chỉ Email</label>
            <div className="input-field-wrap">
              <Mail className="input-icon" size={18} />
              <input 
                type="email" 
                id="auth-email" 
                placeholder="example@gmail.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="auth-pass">Mật khẩu</label>
            <div className="input-field-wrap">
              <Lock className="input-icon" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                id="auth-pass" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {activeTab === 'register' && (
            <div className="input-group">
              <label htmlFor="reg-confirm-pass">Xác nhận mật khẩu</label>
              <div className="input-field-wrap">
                <Lock className="input-icon" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="reg-confirm-pass" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary auth-submit-btn">
            {activeTab === 'login' ? 'Đăng nhập ngay' : 'Đăng ký tài khoản'}
          </button>
        </form>

        <div className="auth-footer">
          {activeTab === 'login' ? (
            <p>Chưa có tài khoản? <span onClick={() => setActiveTab('register')}>Đăng ký miễn phí</span></p>
          ) : (
            <p>Đã có tài khoản rồi? <span onClick={() => setActiveTab('login')}>Đăng nhập tại đây</span></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
