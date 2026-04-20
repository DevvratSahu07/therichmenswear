import React, { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../../api/api';
import { toast } from 'react-toastify';
import './Admin.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getAllOrders().then((res) => setOrders(res.data.orders));
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
      toast.success('Status updated');
    } catch {
      toast.error('Error updating status');
    }
  };

  return (
    <div className="admin-page">
      <h1>Orders Management</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order #</th>
            <th>User</th>
            <th>Amount</th>
            <th>Items</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.orderNumber}</td>
              <td>{o.UserId}</td>
              <td>₹{Math.round(o.totalAmount)}</td>
              <td>{o.items?.length} items</td>
              <td>
                <select
                  value={o.status}
                  onChange={(e) => handleStatusChange(o.id, e.target.value)}
                  className="status-select"
                >
                  {['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
              <td>{new Date(o.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;