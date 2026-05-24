import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { Filter, Grid, RefreshCw } from 'lucide-react';

const ProductList = ({ products, onViewDetails, searchTerm, setSearchTerm }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  // Categories list
  const categories = [
    { id: 'all', name: 'Tất cả sản phẩm' },
    { id: 'technology', name: 'Công nghệ' },
    { id: 'fashion', name: 'Thời trang' },
    { id: 'accessories', name: 'Phụ kiện' },
    { id: 'decor', name: 'Trang trí nhà cửa' }
  ];

  // Search + Category filter + Sort logic
  const processedProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (searchTerm.trim() !== '') {
      const query = searchTerm.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, selectedCategory, searchTerm, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSortBy('featured');
    setSearchTerm('');
  };

  return (
    <section id="products-catalog" className="catalog-section">
      <div className="catalog-header">
        <div className="catalog-title-area">
          <h2>Bộ Sưu Tập Sản Phẩm</h2>
          <p>Khám phá các sản phẩm chất lượng cao nhất được tinh tuyển dành riêng cho bạn.</p>
        </div>

        <div className="catalog-controls">
          <div className="sort-wrapper">
            <Filter size={16} className="sort-icon" />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="featured">Nổi bật</option>
              <option value="price-low">Giá: Thấp đến Cao</option>
              <option value="price-high">Giá: Cao đến Thấp</option>
              <option value="rating">Đánh giá cao nhất</option>
            </select>
          </div>
        </div>
      </div>

      <div className="category-tabs-container">
        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {(selectedCategory !== 'all' || searchTerm.trim() !== '') && (
        <div className="active-filters-info">
          <span>Tìm thấy {processedProducts.length} sản phẩm phù hợp</span>
          <button className="reset-filters-link" onClick={handleResetFilters}>
            <RefreshCw size={12} />
            <span>Xóa bộ lọc</span>
          </button>
        </div>
      )}

      {processedProducts.length === 0 ? (
        <div className="catalog-empty-state">
          <div className="empty-icon-wrap">
            <Grid size={48} className="empty-icon animate-pulse" />
          </div>
          <h3>Không tìm thấy sản phẩm nào</h3>
          <p>Rất tiếc! Không có sản phẩm nào khớp với tìm kiếm hoặc bộ lọc hiện tại của bạn.</p>
          <button className="btn-secondary" onClick={handleResetFilters}>
            Đặt lại tất cả bộ lọc
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {processedProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onViewDetails={onViewDetails} 
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductList;
