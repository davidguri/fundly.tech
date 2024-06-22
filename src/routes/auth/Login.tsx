import React from "react"
import styles from "./styles/Login.module.scss"
import { useNavigate } from "react-router-dom";

export default function Login() {

  const nav = useNavigate();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

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
          <div className={styles.submitButton} onClick={() => nav("/")}>
            <text className={styles.submitButtonText}>Log In</text>
          </div>
        </div>
      </main>
    </>
  );
}