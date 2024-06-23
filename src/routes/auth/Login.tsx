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
        <div className={styles.titleContainer}>
          <text className={styles.title}>Welcome Back!</text>
        </div>
        <div className={styles.formContainer}>
          <input className={styles.formInput} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          <input className={styles.formInput} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        </div>
        <div className={styles.submitButtonContainer}>
          <div className={styles.submitButton} onClick={login}>
            <text className={styles.submitButtonText}>Log In</text>
          </div>
        </div>
      </main>
    </>
  );
}