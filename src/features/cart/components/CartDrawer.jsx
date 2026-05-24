import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { CART_CONFIG, PROMO_CODES } from '../../../config/constants';
import { X, Plus, Minus, Trash2, Tag, ShoppingBag, ArrowRight } from 'lucide-react';

const CartDrawer = ({ isOpen, onClose, onOpenCheckout, onOpenAuth }) => {
  const { cart, updateQuantity, removeFromCart, user, showToast } = useApp();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Format money helper
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Configuration-driven promo code validation
  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();

    if (!code) {
      showToast('Vui lòng nhập mã giảm giá', 'warning');
      return;
    }

    const matchedPromo = PROMO_CODES[code];
    if (matchedPromo) {
      setDiscountPercent(matchedPromo.percent);
      setAppliedPromo(code);
      showToast(`Áp dụng mã ${code} thành công! ${matchedPromo.label}.`, 'success');
    } else {
      showToast('Mã giảm giá không hợp lệ hoặc đã hết hạn!', 'error');
    }
    setPromoCode('');
  };

  const handleRemovePromo = () => {
    setDiscountPercent(0);
    setAppliedPromo('');
    showToast('Đã hủy áp dụng mã giảm giá', 'info');
  };

  // Configuration-driven calculations
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const isFreeShipping = subtotal >= CART_CONFIG.FREE_SHIPPING_THRESHOLD;
  const shippingFee = isFreeShipping || subtotal === 0 ? 0 : CART_CONFIG.DEFAULT_SHIPPING_FEE;
  const grandTotal = subtotal - discountAmount + shippingFee;

  const progressToFreeShipping = Math.min((subtotal / CART_CONFIG.FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = CART_CONFIG.FREE_SHIPPING_THRESHOLD - subtotal;

  const handleCheckoutClick = () => {
    if (!user) {
      showToast('Vui lòng đăng nhập để thực hiện thanh toán!', 'warning');
      onOpenAuth();
      return;
    }
    
    onOpenCheckout({
      finalTotal: grandTotal,
      promoDiscount: discountAmount,
      currentPromoCode: appliedPromo
    });
  };

  return (
    <>
      {/* Background Overlay */}
      <div className={`drawer-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />

      {/* Cart Sidebar */}
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div className="drawer-title">
            <ShoppingBag size={22} className="glow-icon" />
            <h3>Giỏ hàng của bạn</h3>
            <span className="cart-badge-count">{cart.reduce((s, i) => s + i.quantity, 0)}</span>
          </div>
          <button className="drawer-close-btn" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className="drawer-empty-body">
            <div className="empty-cart-illustration">
              <ShoppingBag size={80} className="animated-bag" />
              <div className="ripple-circle" />
            </div>
            <h4>Giỏ hàng của bạn còn trống</h4>
            <p>Trông thật cô đơn! Hãy quay lại cửa hàng và chọn cho mình những sản phẩm yêu thích nhé.</p>
            <button className="btn-primary start-shopping-btn" onClick={onClose}>
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          /* Cart with Items */
          <div className="drawer-body">
            {/* Free Shipping Progress */}
            <div className="shipping-progress-container">
              {remainingForFreeShipping > 0 ? (
                <p className="shipping-progress-text">
                  Mua thêm <strong>{formatPrice(remainingForFreeShipping)}</strong> để được <strong>Miễn phí vận chuyển!</strong>
                </p>
              ) : (
                <p className="shipping-progress-text success">
                  🎉 Chúc mừng! Đơn hàng của bạn đã đủ điều kiện được <strong>Miễn phí vận chuyển!</strong>
                </p>
              )}
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${progressToFreeShipping}%` }} />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="cart-items-list">
              {cart.map(item => (
                <div key={item.id} className="cart-item-card">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-details">
                    <div className="cart-item-header">
                      <h4 className="cart-item-name">{item.name}</h4>
                      <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <span className="cart-item-cat">{item.category === 'technology' ? 'Công nghệ' : item.category === 'fashion' ? 'Thời trang' : item.category === 'accessories' ? 'Phụ kiện' : 'Decor'}</span>
                    <div className="cart-item-footer">
                      <span className="cart-item-price">{formatPrice(item.price)}</span>
                      <div className="qty-selectors">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="qty-btn">
                          <Minus size={12} />
                        </button>
                        <span className="qty-number">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="qty-btn">
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code & Totals */}
            <div className="drawer-footer">
              <form onSubmit={handleApplyPromo} className="promo-form">
                <div className="promo-input-wrap">
                  <Tag size={16} className="promo-icon" />
                  <input 
                    type="text" 
                    placeholder="Mã giảm giá (GIFT10, ANTIGRAVITY...)" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={!!appliedPromo}
                  />
                </div>
                {appliedPromo ? (
                  <button type="button" className="btn-secondary promo-btn cancel" onClick={handleRemovePromo}>
                    Hủy
                  </button>
                ) : (
                  <button type="submit" className="btn-secondary promo-btn">
                    Áp dụng
                  </button>
                )}
              </form>

              {appliedPromo && (
                <div className="applied-promo-tag">
                  <span>Mã đang dùng: <strong>{appliedPromo}</strong> (-{discountPercent}%)</span>
                </div>
              )}

              <div className="totals-summary">
                <div className="total-row">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="total-row discount">
                    <span>Giảm giá:</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="total-row">
                  <span>Phí vận chuyển:</span>
                  <span>{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span>
                </div>
                <hr className="divider" />
                <div className="total-row grand-total">
                  <span>Tổng tiền thanh toán:</span>
                  <span className="total-glow-price">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <button className="btn-primary checkout-trigger-btn" onClick={handleCheckoutClick}>
                <span>Tiến hành thanh toán</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
