import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../api/api';
import { loginSuccess } from '../redux/store';
import { toast } from 'react-toastify';
import './Auth.css';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await registerUser(form);
      dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-left">
          <h2>Already have an account?</h2>
          <p>Login with your email & password</p>
          <Link to="/login" className="auth-switch-btn">LOGIN</Link>
        </div>
        <div className="auth-right">
          <h2>Create Account</h2>
          <p>Start your fashion journey with The Rich Mens's wear</p>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Full Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input type="email" placeholder="Email Address" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input type="tel" placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input type="password" placeholder="Create Password (min 6 chars)" required minLength="6" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button type="submit" disabled={loading} className="auth-submit-btn">
              {loading ? 'Creating...' : 'CREATE ACCOUNT'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
