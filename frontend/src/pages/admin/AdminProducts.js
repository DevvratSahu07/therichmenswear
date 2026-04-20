import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../api/api';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './Admin.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await getProducts({ limit: 50 });
    setProducts(res.data.products);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      toast.success('Product deleted');
    } catch {
      toast.error('Error deleting product');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Products Management</h1>
        <Link to="/admin/products/add" className="add-btn"><FaPlus /> Add Product</Link>
      </div>

      <div className="admin-nav">
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/orders">Orders</Link>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td><img src={p.image} alt={p.name} className="table-img" /></td>
              <td>{p.name}</td>
              <td>{p.brand}</td>
              <td>{p.category}</td>
              <td>₹{p.price}</td>
              <td>{p.stock}</td>
              <td>
                <button className="action-btn edit"><FaEdit /></button>
                <button className="action-btn delete" onClick={() => handleDelete(p.id)}><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProducts;