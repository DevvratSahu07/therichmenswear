import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrders, getProducts } from '../../api/api';
import { FaBoxOpen, FaShoppingCart, FaRupeeSign, FaUsers } from 'react-icons/fa';
import './Admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, products: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    Promise.all([getAllOrders(), getProducts({ limit: 1 })]).then(([ordersRes, productsRes]) => {
      const orders = ordersRes.data.orders;
      const revenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.totalAmount : 0), 0);
      setStats({ orders: orders.length, revenue: Math.round(revenue), products: productsRes.data.totalProducts });
      setRecentOrders(orders.slice(0, 5));
    });
  }, []);

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <div className="admin-nav">
        <Link to="/admin/products">Products</Link>
        <Link to="/admin/products/add">Add Product</Link>
        <Link to="/admin/orders">Orders</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <FaShoppingCart size={30} color="#ff3f6c" />
          <div><h3>{stats.orders}</h3><p>Total Orders</p></div>
        </div>
        <div className="stat-card">
          <FaRupeeSign size={30} color="#ff905a" />
          <div><h3>₹{stats.revenue.toLocaleString()}</h3><p>Total Revenue</p></div>
        </div>
        <div className="stat-card">
          <FaBoxOpen size={30} color="#03a685" />
          <div><h3>{stats.products}</h3><p>Total Products</p></div>
        </div>
      </div>

      <div className="recent-orders">
        <h2>Recent Orders</h2>
        <table>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o) => (
              <tr key={o.id}>
                <td>{o.orderNumber}</td>
                <td>₹{Math.round(o.totalAmount)}</td>
                <td><span className={`status-badge ${o.status}`}>{o.status}</span></td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;