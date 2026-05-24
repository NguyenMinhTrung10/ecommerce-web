import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { X, CreditCard, Wallet, Truck, ShoppingBag } from 'lucide-react';
import confetti from 'canvas-confetti';

const CheckoutModal = ({ isOpen, onClose, finalTotal, promoDiscount, currentPromoCode }) => {
  const { cart, clearCart, showToast, user } = useApp();
  const [fullName, setFullName] = useState(user ? user.username : '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Hà Nội');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  if (!isOpen || cart.length === 0) return null;

  // Format money helper
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();

    if (!fullName || !phone || !address || !city) {
      showToast('Vui lòng nhập đầy đủ thông tin giao hàng', 'warning');
      return;
    }

    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#aa3bff', '#c084fc', '#4f46e5', '#38bdf8']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#aa3bff', '#c084fc', '#4f46e5', '#38bdf8']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    clearCart();
    showToast('🎉 Đơn hàng của bạn đã được đặt thành công!', 'success');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content checkout-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <h2>Xác nhận thanh toán</h2>
        <p className="checkout-subtitle">Hãy hoàn tất thông tin giao nhận bên dưới để hoàn tất đặt hàng.</p>

        <div className="checkout-grid">
          {/* Shipping Form */}
          <form onSubmit={handleCheckoutSubmit} className="checkout-form">
            <h3>Thông tin vận chuyển</h3>

            <div className="input-group">
              <label htmlFor="chk-name">Họ và tên người nhận</label>
              <input 
                type="text" 
                id="chk-name" 
                placeholder="Nguyễn Văn A" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="chk-phone">Số điện thoại</label>
              <input 
                type="tel" 
                id="chk-phone" 
                placeholder="09xxxxxxxx" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="chk-addr">Địa chỉ chi tiết (Số nhà, tên đường, phường/xã)</label>
              <input 
                type="text" 
                id="chk-addr" 
                placeholder="123 Đường Láng" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="chk-city">Tỉnh / Thành phố</label>
              <select id="chk-city" value={city} onChange={(e) => setCity(e.target.value)}>
                <option value="Hà Nội">Hà Nội</option>
                <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
                <option value="Cần Thơ">Cần Thơ</option>
                <option value="Hải Phòng">Hải Phòng</option>
              </select>
            </div>

            <h3>Phương thức thanh toán</h3>
            <div className="payment-options">
              <label className={`payment-card ${paymentMethod === 'cod' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="cod" 
                  checked={paymentMethod === 'cod'} 
                  onChange={() => setPaymentMethod('cod')}
                />
                <Truck className="pay-icon" size={20} />
                <div className="pay-desc">
                  <strong>Thanh toán COD</strong>
                  <span>Nhận hàng rồi mới thanh toán</span>
                </div>
              </label>

              <label className={`payment-card ${paymentMethod === 'card' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="card" 
                  checked={paymentMethod === 'card'} 
                  onChange={() => setPaymentMethod('card')}
                />
                <CreditCard className="pay-icon" size={20} />
                <div className="pay-desc">
                  <strong>Thẻ tín dụng / ATM</strong>
                  <span>Simulated Visa, Mastercard, Napas</span>
                </div>
              </label>

              <label className={`payment-card ${paymentMethod === 'e-wallet' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="e-wallet" 
                  checked={paymentMethod === 'e-wallet'} 
                  onChange={() => setPaymentMethod('e-wallet')}
                />
                <Wallet className="pay-icon" size={20} />
                <div className="pay-desc">
                  <strong>Ví điện tử Momo / Zalopay</strong>
                  <span>Quét mã QR thanh toán nhanh</span>
                </div>
              </label>
            </div>

            <button type="submit" className="btn-primary checkout-btn-submit">
              Xác nhận & Đặt hàng ngay
            </button>
          </form>

          {/* Order Summary */}
          <div className="checkout-summary">
            <h3>Đơn hàng của bạn</h3>
            <div className="checkout-summary-items">
              {cart.map(item => (
                <div key={item.id} className="checkout-item-row">
                  <div className="checkout-item-info">
                    <span className="checkout-item-qty">{item.quantity}x</span>
                    <span className="checkout-item-name">{item.name}</span>
                  </div>
                  <span className="checkout-item-price">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="checkout-totals">
              <div className="checkout-total-row">
                <span>Tạm tính</span>
                <span>{formatPrice(cart.reduce((sum, item) => sum + item.price * item.quantity, 0))}</span>
              </div>
              
              {promoDiscount > 0 && (
                <div className="checkout-total-row discount">
                  <span>Giảm giá ({currentPromoCode})</span>
                  <span>-{formatPrice(promoDiscount)}</span>
                </div>
              )}

              <div className="checkout-total-row">
                <span>Vận chuyển</span>
                <span className="free-shipping">Miễn phí</span>
              </div>

              <hr />

              <div className="checkout-total-row final">
                <span>Tổng cộng</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <div className="checkout-security-badge">
              <ShoppingBag size={16} />
              <span>Giao dịch của bạn luôn được bảo mật tuyệt đối</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
