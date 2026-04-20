import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="order-success">
      <div className="success-icon">✅</div>
      <h1>Order Placed Successfully!</h1>
      <p>Your order has been confirmed and will be shipped soon.</p>
      {order && (
        <div className="order-info">
          <p><strong>Order Number:</strong> {order.orderNumber}</p>
          <p><strong>Total Amount:</strong> ₹{Math.round(order.totalAmount)}</p>
          <p><strong>Status:</strong> {order.status}</p>
        </div>
      )}
      <div className="success-actions">
        <Link to="/orders" className="view-orders-btn">VIEW MY ORDERS</Link>
        <Link to="/" className="continue-btn">CONTINUE SHOPPING</Link>
      </div>
    </div>
  );
};

export default OrderSuccess;