import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { X, Star, ShoppingCart, Shield, Truck, RefreshCw } from 'lucide-react';

const ProductDetails = ({ product, isOpen, onClose }) => {
  const { addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  // Format currency helper
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < product.inStock) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCartClick = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content product-details-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          <X size={22} />
        </button>

        <div className="details-grid">
          {/* Left Column: Image Area */}
          <div className="details-image-area">
            <img src={product.image} alt={product.name} className="details-main-img" />
            {product.tag && (
              <span className="details-tag-badge">{product.tag}</span>
            )}
          </div>

          {/* Right Column: Information & Actions */}
          <div className="details-info-area">
            <span className="details-cat-breadcrumb">
              Sản phẩm / {product.category === 'technology' ? 'Công nghệ' : product.category === 'fashion' ? 'Thời trang' : product.category === 'accessories' ? 'Phụ kiện' : 'Decor'}
            </span>
            
            <h2 className="details-title">{product.name}</h2>

            {/* Ratings */}
            <div className="details-ratings">
              <div className="stars-wrap">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={i < Math.floor(product.rating) ? 'star-icon-filled' : 'star-icon-empty'} 
                  />
                ))}
              </div>
              <span className="rating-score">{product.rating}</span>
              <span className="reviews-count">({product.reviewsCount} đánh giá từ khách hàng)</span>
            </div>

            {/* Price block */}
            <div className="details-prices">
              <span className="details-current-price">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="details-original-price">{formatPrice(product.originalPrice)}</span>
                  <span className="details-discount-tag">
                    Tiết kiệm {formatPrice(product.originalPrice - product.price)} ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%)
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="details-description">{product.description}</p>

            {/* Specifications list */}
            {product.specs && product.specs.length > 0 && (
              <div className="details-specs-container">
                <h4>Thông số kỹ thuật:</h4>
                <ul className="details-specs-list">
                  {product.specs.map((spec, i) => (
                    <li key={i}>{spec}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Stock indicator */}
            <div className="details-stock-status">
              <span>Trạng thái: </span>
              {product.inStock > 0 ? (
                <span className="in-stock-label">Còn hàng (chỉ còn {product.inStock} sản phẩm)</span>
              ) : (
                <span className="out-of-stock-label">Hết hàng</span>
              )}
            </div>

            {/* Purchase Row */}
            {product.inStock > 0 && (
              <div className="details-purchase-row">
                <div className="qty-selectors detail-qty">
                  <button onClick={handleDecrease} className="qty-btn" disabled={quantity <= 1}>
                    <span>-</span>
                  </button>
                  <span className="qty-number">{quantity}</span>
                  <button onClick={handleIncrease} className="qty-btn" disabled={quantity >= product.inStock}>
                    <span>+</span>
                  </button>
                </div>

                <button className="btn-primary details-add-btn" onClick={handleAddToCartClick}>
                  <ShoppingCart size={18} />
                  <span>Thêm vào giỏ hàng</span>
                </button>
              </div>
            )}

            {/* Trust assurances badges */}
            <div className="details-assurances">
              <div className="assurance-card">
                <Shield size={18} />
                <span>Bảo hành chính hãng 12 tháng</span>
              </div>
              <div className="assurance-card">
                <Truck size={18} />
                <span>Giao hàng hỏa tốc trong 2 giờ</span>
              </div>
              <div className="assurance-card">
                <RefreshCw size={18} />
                <span>Đổi trả 1-đổi-1 trong 7 ngày</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
