import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { COUPONS } from '../data/products';

export default function SidebarCart({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onCheckout,
  couponApplied,
  onApplyCoupon,
  onRemoveCoupon
}) {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  // Calculate pricing
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  let discount = 0;
  if (couponApplied) {
    const value = COUPONS[couponApplied];
    if (value) {
      if (value < 1) {
        // Percentage coupon
        discount = subtotal * value;
      } else {
        // Flat coupon
        discount = Math.min(value, subtotal);
      }
    }
  }

  const total = Math.max(0, subtotal - discount);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (COUPONS[code] !== undefined) {
      onApplyCoupon(code);
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  return (
    <div className={`cart-drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="cart-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={20} className="logo-icon" />
            <h2 className="cart-title">Your Shopping Cart</h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close cart sidebar">
            <X size={20} />
          </button>
        </div>

        {/* Content list */}
        <div className="cart-items-container">
          {cartItems.length === 0 ? (
            <div className="empty-cart-state">
              <ShoppingBag size={48} className="empty-cart-icon" />
              <h3 className="empty-cart-title">Your cart is empty</h3>
              <p className="empty-cart-text">Looks like you haven't added anything to your cart yet.</p>
              <button className="btn-primary" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div className="cart-item" key={`${item.product.id}-${item.selectedColor || ''}-${idx}`}>
                <img 
                  src={item.product.image} 
                  alt={item.product.name} 
                  className="cart-item-img" 
                />
                
                <div className="cart-item-info">
                  <h4 className="cart-item-name">{item.product.name}</h4>
                  {item.selectedColor && (
                    <span className="cart-item-variant">Color: {item.selectedColor}</span>
                  )}
                  
                  <div className="cart-item-actions" style={{ marginTop: '0.5rem' }}>
                    <div className="qty-controls">
                      <button 
                        className="qty-btn" 
                        onClick={() => onUpdateQty(item.product.id, item.selectedColor, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button 
                        className="qty-btn" 
                        onClick={() => onUpdateQty(item.product.id, item.selectedColor, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span className="cart-item-price">${(item.product.price * item.quantity).toFixed(2)}</span>
                      <button 
                        className="delete-btn" 
                        onClick={() => onRemoveItem(item.product.id, item.selectedColor)}
                        aria-label="Delete item from cart"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            {/* Coupon codes */}
            {!couponApplied ? (
              <form className="cart-coupon-section" onSubmit={handleApplyCoupon}>
                <input
                  type="text"
                  placeholder="Coupon code (e.g. WELCOME10)"
                  className="coupon-input"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value);
                    setCouponError('');
                  }}
                />
                <button type="submit" className="coupon-btn">Apply</button>
              </form>
            ) : (
              <div className="coupon-badge">
                <span>Applied: {couponApplied}</span>
                <button className="remove-coupon-btn" onClick={onRemoveCoupon}>
                  Remove
                </button>
              </div>
            )}
            {couponError && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '-0.5rem', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
                {couponError}
              </p>
            )}

            {/* Calculations */}
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="cart-summary-row" style={{ color: 'var(--success)' }}>
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="cart-summary-row">
              <span>Shipping</span>
              <span style={{ color: 'var(--success)', fontWeight: '600' }}>FREE</span>
            </div>
            
            <div className="cart-summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button className="checkout-btn" onClick={onCheckout}>
              Proceed to Checkout
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
