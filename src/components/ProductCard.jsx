import React from 'react';
import { Eye, ShoppingCart, Star } from 'lucide-react';

export default function ProductCard({ product, onQuickView, onAddToCart }) {
  return (
    <article className="product-card">
      {product.badge && (
        <span className="product-card-badge">{product.badge}</span>
      )}
      
      <div className="product-image-container" onClick={() => onQuickView(product)}>
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-img" 
          loading="lazy" 
        />
        <div className="quick-view-overlay">
          <button 
            className="quick-view-btn"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
          >
            <Eye size={16} />
            Quick View
          </button>
        </div>
      </div>

      <div className="product-card-info">
        <span className="product-card-category">{product.category}</span>
        <h3 
          className="product-card-name" 
          onClick={() => onQuickView(product)}
        >
          {product.name}
        </h3>
        
        <div className="product-rating">
          <Star className="star-icon" size={14} />
          <span>{product.rating}</span>
          <span style={{ color: 'var(--text-muted)' }}>({product.reviews})</span>
        </div>

        <div className="product-card-footer">
          <span className="product-card-price">${product.price.toFixed(2)}</span>
          <button 
            className="btn-primary" 
            onClick={() => onAddToCart(product)}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={16} />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
