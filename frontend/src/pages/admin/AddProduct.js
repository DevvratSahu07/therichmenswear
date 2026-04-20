import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../api/api';
import { toast } from 'react-toastify';
import './Admin.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', description: '', price: '', discount: '0',
    category: '', brand: '', stock: '', gender: 'unisex',
    sizes: '', colors: '', isFeatured: false,
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      images.forEach((img) => formData.append('images', img));

      await createProduct(formData);
      toast.success('Product created successfully!');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating product');
    }
    setLoading(false);
  };

  return (
    <div className="admin-page">
      <h1>Add New Product</h1>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Product Name *</label>
            <input required placeholder="e.g., Classic Cotton T-Shirt" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Brand *</label>
            <input required placeholder="e.g., H&M" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Price (₹) *</label>
            <input required type="number" placeholder="e.g., 999" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Discount (%)</label>
            <input type="number" placeholder="e.g., 30" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Category *</label>
            <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="">Select Category</option>
              {['T-Shirts', 'Jeans', 'Dresses', 'Kurtis', 'Blazers', 'Shoes', 'Bags', 'Accessories', 'Beauty', 'Kids Wear'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Gender *</label>
            <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              {['men', 'women', 'kids', 'unisex'].map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Stock *</label>
            <input required type="number" placeholder="e.g., 100" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Sizes (comma-separated)</label>
            <input placeholder="e.g., S,M,L,XL or 28,30,32" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Colors (comma-separated)</label>
            <input placeholder="e.g., Red,Blue,Green" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Featured Product</label>
            <select value={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.value })}>
              <option value={false}>No</option>
              <option value={true}>Yes</option>
            </select>
          </div>
        </div>

        <div className="form-group full">
          <label>Description</label>
          <textarea rows="4" placeholder="Product description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>

        <div className="form-group full">
          <label>Product Images</label>
          <input type="file" multiple accept="image/*" onChange={(e) => setImages([...e.target.files])} />
          <small>Upload up to 5 images</small>
        </div>

        <button type="submit" disabled={loading} className="submit-product-btn">
          {loading ? 'Creating...' : 'CREATE PRODUCT'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;