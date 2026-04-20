import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaUser, FaShoppingBag, FaHeart, FaMapMarkerAlt, FaEdit } from 'react-icons/fa';
import { updateProfile } from '../api/api';
import { updateUser } from '../redux/store';
import { toast } from 'react-toastify';
import './Profile.css';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile(form);
      dispatch(updateUser(res.data.user));
      setEditing(false);
      toast.success('Profile updated!');
    } catch {
      toast.error('Error updating profile');
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-sidebar">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <h3>{user?.name}</h3>
          <p>{user?.email}</p>
        </div>
        <nav className="profile-nav">
          <Link to="/orders"><FaShoppingBag /> My Orders</Link>
          <Link to="/wishlist"><FaHeart /> My Wishlist</Link>
        </nav>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <div className="section-header-row">
            <h2><FaUser /> Personal Information</h2>
            <button onClick={() => setEditing(!editing)} className="edit-btn">
              <FaEdit /> {editing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {editing ? (
            <form onSubmit={handleUpdate} className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <button type="submit" className="save-btn">SAVE CHANGES</button>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-row">
                <span className="info-label">Name</span>
                <span>{user?.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email</span>
                <span>{user?.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Phone</span>
                <span>{user?.phone || 'Not added'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Role</span>
                <span className="role-badge">{user?.role}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;