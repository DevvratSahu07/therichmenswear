import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../api/api';
import { loginSuccess } from '../redux/store';
import { toast } from 'react-toastify';
import './Auth.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(form);
      dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));
      toast.success(`Welcome back, ${res.data.user.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-left">
          <h2>Looks like you're new here!</h2>
          <p>Sign up with your mobile number to get started</p>
          <Link to="/register" className="auth-switch-btn">CREATE ACCOUNT</Link>
        </div>
        <div className="auth-right">
          <h2>Login</h2>
          <p>Get access to your Orders, Wishlist and Recommendations</p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter Email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Enter Password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <div className="auth-helper">
              <small>Test: user@myntra.com / user123</small>
              <small>Admin: admin@myntra.com / admin123</small>
            </div>
            <button type="submit" disabled={loading} className="auth-submit-btn">
              {loading ? 'Logging in...' : 'LOGIN'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;