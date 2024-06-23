import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';

interface ProtectedProps {
  children: ReactNode;
}

const Protected: React.FC<ProtectedProps> = ({ children }) => {
  const [user, setUser] = useState(auth.currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        navigate('/'); // Navigate to home page after authentication
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (user) {
    return <>{children}</>;
  } else {
    return <Navigate to="/welcome" />;
  }
};

export default Protected;
