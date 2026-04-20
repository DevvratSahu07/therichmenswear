import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { removeFromCart, updateQuantity } from '../redux/store';
import { toast } from 'react-toastify';
import './Cart.css';

const Cart = () => {
  const cart = useSelector((state) => state.cart.items);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, i) => sum + (i.finalPrice || i.price) * i.quantity, 0);
  const discount = cart.reduce((sum, i) => sum + (i.price - (i.finalPrice || i.price)) * i.quantity, 0);
  const deliveryFee = subtotal > 499 ? 0 : 49;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.info('Please login to checkout');
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon">🛍️</div>
        <h2>Hey, it feels so light!</h2>
        <p>There is nothing in your bag. Let's add some items.</p>
        <Link to="/products" className="continue-shopping-btn">CONTINUE SHOPPING</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-items">
        <h2>Shopping Bag ({cart.length} items)</h2>
        {cart.map((item) => (
          <div key={`${item.id}-${item.selectedSize}`} className="cart-item">
            <img src={item.image || 'https://via.placeholder.com/120'} alt={item.name} className="cart-item-img" />
            <div className="cart-item-info">
              <h4>{item.brand}</h4>
              <p>{item.name}</p>
              {item.selectedSize && <p className="item-size">Size: <strong>{item.selectedSize}</strong></p>}
              <div className="item-price">
                <span className="item-final-price">₹{Math.round((item.finalPrice || item.price) * item.quantity)}</span>
                {item.discount > 0 && (
                  <>
                    <span className="item-original-price">₹{item.price * item.quantity}</span>
                    <span className="item-discount">{item.discount}% off</span>
                  </>
                )}
              </div>
              <div className="quantity-controls">
                <button
                  onClick={() => {
                    if (item.quantity === 1) dispatch(removeFromCart({ id: item.id, selectedSize: item.selectedSize }));
                    else dispatch(updateQuantity({ id: item.id, selectedSize: item.selectedSize, quantity: item.quantity - 1 }));
                  }}
                >
                  <FaMinus />
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => dispatch(updateQuantity({ id: item.id, selectedSize: item.selectedSize, quantity: item.quantity + 1 }))}
                >
                  <FaPlus />
                </button>
              </div>
            </div>
            <button
              className="remove-btn"
              onClick={() => dispatch(removeFromCart({ id: item.id, selectedSize: item.selectedSize }))}
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>PRICE DETAILS</h3>
        <div className="summary-row">
          <span>Price ({cart.length} items)</span>
          <span>₹{Math.round(subtotal + discount)}</span>
        </div>
        <div className="summary-row">
          <span>Discount</span>
          <span className="discount-text">- ₹{Math.round(discount)}</span>
        </div>
        <div className="summary-row">
          <span>Delivery Charges</span>
          <span className={deliveryFee === 0 ? 'free-text' : ''}>
            {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
          </span>
        </div>
        <hr />
        <div className="summary-row total">
          <span>TOTAL AMOUNT</span>
          <span>₹{Math.round(total)}</span>
        </div>
        <p className="savings-text">🎉 You will save ₹{Math.round(discount)} on this order</p>
        <button className="checkout-btn" onClick={handleCheckout}>
          PLACE ORDER
        </button>
        <div className="safe-payment">
          <span>🔒 Safe and Secure Payments</span>
        </div>
      </div>
    </div>
  );
};

export default Cart;