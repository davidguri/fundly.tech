import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider'
import Loading from '../Loading';

interface ProtectedProps {
  children: ReactNode;
}

const Protected: React.FC<ProtectedProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const paymentStatus = JSON.parse(localStorage.getItem("payment_complete"))
  const owner = JSON.parse(localStorage.getItem("owner"))

  if (loading) {
    return <Loading />;
  }

  if (user && (owner ? paymentStatus : true)) {
    return <>{children}</>;
  } else {
    return <Navigate to="/welcome" state={{ from: location }} />;
  }
};

export default Protected;
