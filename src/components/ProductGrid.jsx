import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ 
  products, 
  categories, 
  activeCategory, 
  setActiveCategory, 
  onQuickView, 
  onAddToCart 
}) {
  return (
    <section>
      {/* Category Tabs */}
      <div className="filter-tabs">
        {categories.map((category) => (
          <button
            key={category}
            className={`tab-btn ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid Display */}
      {products.length > 0 ? (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <h3>No products match your criteria</h3>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Try resetting the filters or modifying your search query.</p>
        </div>
      )}
    </section>
  );
}
