import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingSpinner from './lodingspinner';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const location = useLocation();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isAdmin =
    user?.is_staff ||
    user?.is_superuser ||
    user?.isAdmin ||
    user?.role === 'admin';

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
