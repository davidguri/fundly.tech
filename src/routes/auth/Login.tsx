import React from "react"
import styles from "./styles/Login.module.scss"
import { useNavigate } from "react-router-dom";
import { Auth } from "../../controllers/auth.controller";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebase';

export default function Login() {

  const nav = useNavigate();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const login = async () => {
    await Auth.signIn(email, password).catch((error: any) => {
      console.error(error.message);
    })
  }

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        nav('/');
      }
    });

    return () => unsubscribe();
  }, [nav]);

  return (
    <>
      <main className={styles.main}>
        <text className={styles.title}>Welcome Back!</text>
        <input className={styles.formInput} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        <input className={styles.formInput} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        <div className={styles.submitButton} onClick={login}>
          <text className={styles.submitButtonText}>Log In</text>
        </div>
        <text className={styles.alternativeText}>Don't have an account yet? <span className="specialText" style={{ fontWeight: "800" }} onClick={() => nav("/signup")}>Sign Up.</span></text>
      </main>
    </>
  );
}