import React, { useEffect, useState } from 'react';
import { getMyOrders } from '../api/api';
import './Orders.css';

const statusColors = {
  pending: '#ff9800',
  paid: '#2196f3',
  processing: '#9c27b0',
  shipped: '#00bcd4',
  delivered: '#4caf50',
  cancelled: '#f44336',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders().then((res) => {
      setOrders(res.data.orders);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="loading">Loading orders...</div>;

  if (orders.length === 0) {
    return (
      <div className="no-orders">
        <div style={{ fontSize: '60px' }}>📦</div>
        <h2>No orders yet</h2>
        <p>You haven't placed any orders.</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h2>My Orders</h2>
      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <div>
              <h4>Order #{order.orderNumber}</h4>
              <p>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <span className="order-status" style={{ background: statusColors[order.status] }}>
              {order.status.toUpperCase()}
            </span>
          </div>
          <div className="order-items">
            {order.items?.map((item, i) => (
              <div key={i} className="order-item">
                <img src={item.image || 'https://via.placeholder.com/60'} alt={item.name} />
                <div>
                  <h5>{item.brand}</h5>
                  <p>{item.name}</p>
                  {item.selectedSize && <p>Size: {item.selectedSize}</p>}
                  <p>Qty: {item.quantity}</p>
                </div>
                <strong>₹{Math.round((item.finalPrice || item.price) * item.quantity)}</strong>
              </div>
            ))}
          </div>
          <div className="order-footer">
            <span>Total: <strong>₹{Math.round(order.totalAmount)}</strong></span>
            <span>Payment: {order.paymentId}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;