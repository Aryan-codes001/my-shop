import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Star, Check } from 'lucide-react';

export default function ProductDetailModal({ product, onClose, onAddToCart }) {
  const [selectedColor, setSelectedColor] = useState('');

  // Reset selected color when the product changes
  useEffect(() => {
    if (product && product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
  }, [product]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const handleAddToCart = () => {
    // Add to cart with color metadata
    onAddToCart(product, selectedColor);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn close-modal-btn" onClick={onClose} aria-label="Close detail modal">
          <X size={20} />
        </button>

        <div className="product-detail-layout">
          <div className="detail-img-container">
            <img src={product.image} alt={product.name} className="detail-img" />
          </div>

          <div className="detail-info">
            <div>
              <span className="detail-category">{product.category}</span>
              <h2 className="detail-name">{product.name}</h2>
            </div>

            <div className="product-rating">
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <Star className="star-icon" size={16} />
                <span>{product.rating}</span>
              </div>
              <span style={{ color: 'var(--text-muted)' }}>• {product.reviews} customer reviews</span>
            </div>

            <div className="detail-price">${product.price.toFixed(2)}</div>

            <p className="detail-description">{product.description}</p>

            {product.colors && product.colors.length > 0 && (
              <div className="variant-picker">
                <span className="variant-title">Select Color</span>
                <div className="bubble-container">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className={`bubble-btn ${selectedColor === color ? 'selected' : ''}`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.features && product.features.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                <span className="variant-title" style={{ display: 'block', marginBottom: '0.5rem' }}>Features</span>
                <ul className="features-list">
                  {product.features.map((feature, idx) => (
                    <li key={idx}>
                      <Check className="check-icon" size={14} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="detail-actions">
              <button className="btn-primary" onClick={handleAddToCart}>
                <ShoppingCart size={18} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
