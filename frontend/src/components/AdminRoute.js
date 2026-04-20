import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated && user?.role === 'admin' ? children : <Navigate to="/" />;
};

export default AdminRoute;