import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

export default function Protected({ children }: any) {
  const nav = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const checkAuth = async () => {
      auth;

      // Check if user is logged in
      const user = auth.currentUser;

      if (!user) {
        nav("/welcome");
      }
    };

    checkAuth();
  }, [nav]);

  return auth.currentUser ? children : null;
}
