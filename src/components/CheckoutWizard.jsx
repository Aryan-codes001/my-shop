import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, CheckCircle2, CreditCard, MapPin, ClipboardList } from 'lucide-react';
import { COUPONS } from '../data/products';

export default function CheckoutWizard({ cartItems, couponApplied, onClose, onClearCart }) {
  const [step, setStep] = useState(1);
  const [shippingForm, setShippingForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: ''
  });
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [orderId, setOrderId] = useState('');
  const [confetti, setConfetti] = useState([]);

  // Generate confetti for the success page
  useEffect(() => {
    if (step === 4) {
      const items = Array.from({ length: 50 }).map((_, idx) => ({
        id: idx,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 2}s`,
        color: ['#6366f1', '#10b981', '#fbbf24', '#ef4444', '#a855f7'][Math.floor(Math.random() * 5)],
        size: `${Math.random() * 6 + 6}px`
      }));
      setConfetti(items);
      // Generate a mock Order ID
      setOrderId('ORD-' + Math.floor(Math.random() * 89999 + 10000));
      onClearCart();
    }
  }, [step, onClearCart]);

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  let discount = 0;
  if (couponApplied) {
    const value = COUPONS[couponApplied];
    if (value) {
      if (value < 1) {
        discount = subtotal * value;
      } else {
        discount = Math.min(value, subtotal);
      }
    }
  }
  const total = Math.max(0, subtotal - discount);

  // Validation
  const validateShipping = () => {
    const errors = {};
    if (!shippingForm.name.trim()) errors.name = 'Full Name is required';
    if (!shippingForm.email.trim() || !/\S+@\S+\.\S+/.test(shippingForm.email)) errors.email = 'Valid Email is required';
    if (!shippingForm.address.trim()) errors.address = 'Street Address is required';
    if (!shippingForm.city.trim()) errors.city = 'City is required';
    if (!shippingForm.postalCode.trim()) errors.postalCode = 'Postal Code is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePayment = () => {
    const errors = {};
    if (!paymentForm.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) errors.cardNumber = 'Card Number must be 16 digits';
    if (!paymentForm.expiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)) errors.expiry = 'Expiry must be MM/YY';
    if (!paymentForm.cvv.match(/^\d{3}$/)) errors.cvv = 'CVV must be 3 digits';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (validateShipping()) setStep(3);
    } else if (step === 3) {
      if (validatePayment()) setStep(4);
    }
  };

  const handlePrevStep = () => {
    if (step > 1 && step < 4) setStep(step - 1);
  };

  return (
    <div className="checkout-overlay">
      <div className="checkout-modal">
        {/* Confetti Animation Layer */}
        {step === 4 && (
          <div className="confetti-container">
            {confetti.map((c) => (
              <div
                key={c.id}
                className="confetti"
                style={{
                  left: c.left,
                  animationDelay: c.delay,
                  backgroundColor: c.color,
                  width: c.size,
                  height: c.size,
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              />
            ))}
          </div>
        )}

        {/* Wizard Header */}
        <div className="checkout-wizard-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="checkout-wizard-title">Checkout</h2>
            {step < 4 && (
              <button className="icon-btn" onClick={onClose} aria-label="Close checkout">
                <X size={20} />
              </button>
            )}
          </div>

          {/* Stepper Indicators */}
          <div className="wizard-steps">
            <div className={`wizard-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <div className="step-number">{step > 1 ? '✓' : '1'}</div>
              <span className="step-label">Summary</span>
            </div>
            <div className={`wizard-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <div className="step-number">{step > 2 ? '✓' : '2'}</div>
              <span className="step-label">Shipping</span>
            </div>
            <div className={`wizard-step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
              <div className="step-number">{step > 3 ? '✓' : '3'}</div>
              <span className="step-label">Payment</span>
            </div>
            <div className={`wizard-step ${step === 4 ? 'active completed' : ''}`}>
              <div className="step-number">4</div>
              <span className="step-label">Success</span>
            </div>
          </div>
        </div>

        {/* Wizard Body */}
        <div className="checkout-wizard-body">
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="order-review-summary">
                <span className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <ClipboardList size={16} /> Review Order Items
                </span>
                {cartItems.map((item, idx) => (
                  <div key={idx} className="review-item">
                    <span className="review-item-name">
                      {item.product.name} {item.selectedColor ? `(${item.selectedColor})` : ''} x {item.quantity}
                    </span>
                    <span className="review-item-price">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                
                <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
                  <div className="review-item">
                    <span className="review-item-name">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="review-item" style={{ color: 'var(--success)' }}>
                      <span className="review-item-name">Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="review-item">
                    <span className="review-item-name">Shipping</span>
                    <span style={{ color: 'var(--success)', fontWeight: '600' }}>FREE</span>
                  </div>
                  <div className="review-item" style={{ fontWeight: '800', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                    <span className="review-item-name">Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <ShieldCheck size={16} className="check-icon" />
                <span>All purchases are secured via 256-bit SSL encryption.</span>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-grid">
              <span className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} /> Shipping Details
              </span>
              
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="John Doe"
                  value={shippingForm.name}
                  onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                />
                {formErrors.name && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{formErrors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="john@example.com"
                  value={shippingForm.email}
                  onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                />
                {formErrors.email && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{formErrors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="123 Luxury Ave"
                  value={shippingForm.address}
                  onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                />
                {formErrors.address && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{formErrors.address}</span>}
              </div>

              <div className="form-grid two-col" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="New York"
                    value={shippingForm.city}
                    onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                  />
                  {formErrors.city && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{formErrors.city}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Postal Code</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="10001"
                    value={shippingForm.postalCode}
                    onChange={(e) => setShippingForm({ ...shippingForm, postalCode: e.target.value })}
                  />
                  {formErrors.postalCode && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{formErrors.postalCode}</span>}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-grid">
              <span className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCard size={16} /> Payment Information
              </span>

              <div className="form-group">
                <label className="form-label">Credit Card Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="1234 5678 1234 5678"
                  maxLength={19}
                  value={paymentForm.cardNumber}
                  onChange={(e) => {
                    // Format with spaces
                    const raw = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
                    setPaymentForm({ ...paymentForm, cardNumber: formatted });
                  }}
                />
                {formErrors.cardNumber && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{formErrors.cardNumber}</span>}
              </div>

              <div className="form-grid two-col" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Expiry Date (MM/YY)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="12/28"
                    maxLength={5}
                    value={paymentForm.expiry}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      let formatted = val;
                      if (val.length > 2) {
                        formatted = `${val.substring(0, 2)}/${val.substring(2, 4)}`;
                      }
                      setPaymentForm({ ...paymentForm, expiry: formatted });
                    }}
                  />
                  {formErrors.expiry && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{formErrors.expiry}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">CVV</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="123"
                    maxLength={3}
                    value={paymentForm.cvv}
                    onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value.replace(/\D/g, '') })}
                  />
                  {formErrors.cvv && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{formErrors.cvv}</span>}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="success-screen">
              <div className="success-icon-container">
                <CheckCircle2 size={42} />
              </div>
              <h3 className="success-title">Order Confirmed!</h3>
              <p className="success-text">
                Thank you for your purchase, <strong>{shippingForm.name}</strong>. Your payment was processed successfully.
              </p>
              
              <div style={{ background: 'var(--bg-primary)', padding: '1rem 2rem', borderRadius: '12px', marginBottom: '1.5rem', width: '100%', maxWidth: '320px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Order Number</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-color)', letterSpacing: '0.05em' }}>{orderId}</div>
              </div>
              
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                A confirmation email with tracking details has been sent to <strong>{shippingForm.email}</strong>.
              </p>
            </div>
          )}
        </div>

        {/* Wizard Footer */}
        <div className="checkout-wizard-footer">
          {step === 4 ? (
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }} onClick={onClose}>
              Continue Shopping
            </button>
          ) : (
            <>
              {step > 1 ? (
                <button className="btn-secondary" onClick={handlePrevStep}>
                  Back
                </button>
              ) : (
                <button className="btn-secondary" onClick={onClose}>
                  Cancel
                </button>
              )}
              
              <button className="btn-primary" onClick={handleNextStep}>
                {step === 3 ? 'Place Order' : 'Continue'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
