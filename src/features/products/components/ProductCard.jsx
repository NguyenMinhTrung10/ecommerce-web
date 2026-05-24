import React from 'react';
import { useApp } from '../../../context/AppContext';
import { Star, ShoppingCart, Eye } from 'lucide-react';

const ProductCard = ({ product, onViewDetails }) => {
  const { addToCart } = useApp();

  // Format currency helper
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Category label helper
  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'technology': return 'Công nghệ';
      case 'fashion': return 'Thời trang';
      case 'accessories': return 'Phụ kiện';
      case 'decor': return 'Trang trí';
      default: return cat;
    }
  };

  // Calculate discount percentage
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="product-card glassmorphism-hover">
      {/* Image Wrap */}
      <div className="card-image-wrap">
        <img src={product.image} alt={product.name} className="product-img" loading="lazy" />
        
        {/* Badges Overlay */}
        <div className="card-badges">
          {product.tag && (
            <span className="badge-tag">{product.tag}</span>
          )}
          {discountPercent > 0 && (
            <span className="badge-discount">-{discountPercent}%</span>
          )}
        </div>

        {/* Hover Action Bar */}
        <div className="card-hover-actions">
          <button 
            className="action-btn-circle" 
            onClick={() => onViewDetails(product)}
            title="Xem chi tiết"
          >
            <Eye size={18} />
          </button>
          <button 
            className="action-btn-circle" 
            onClick={() => addToCart(product)}
            disabled={product.inStock <= 0}
            title="Thêm vào giỏ"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>

      {/* Details Body */}
      <div className="card-body">
        <div className="card-cat-rating">
          <span className="product-category-label">{getCategoryLabel(product.category)}</span>
          <div className="product-rating">
            <Star size={14} className="star-icon-filled" />
            <span>{product.rating}</span>
          </div>
        </div>

        <h3 className="product-title" onClick={() => onViewDetails(product)}>
          {product.name}
        </h3>

        <p className="product-short-desc">
          {product.description.substring(0, 75)}...
        </p>

        {/* Footer Area: Prices & Cart Action */}
        <div className="card-footer">
          <div className="product-prices">
            <span className="current-price">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="original-price">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          
          <button 
            className="card-add-to-cart-btn"
            onClick={() => addToCart(product)}
            disabled={product.inStock <= 0}
          >
            {product.inStock <= 0 ? 'Hết hàng' : (
              <>
                <ShoppingCart size={14} />
                <span>+ Giỏ</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
