import React from "react";
import styles from "./styles/Signup.module.scss";
import { useNavigate } from "react-router-dom";
import User from "../../models/user.model";
import { Auth } from "../../controllers/auth.controller";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebase';

export default function Signup() {

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const nav = useNavigate()

  const user: User = {
    id: "",
    displayName: name,
    email: email,
    photoUrl: "https://api.dicebear.com/7.x/big-ears-neutral/png?randomizeIds=true"
  }

  const signUp = async () => {
    await Auth.signUp(user, password).catch((error: any) => {
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
          <text className={styles.title}>Let's Get Started!</text>
        </div>
        <div className={styles.formContainer}>
          <input className={styles.formInput} placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} type="text" />
          <input className={styles.formInput} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          <input className={styles.formInput} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        </div>
        <div className={styles.submitButtonContainer}>
          <div className={styles.submitButton} onClick={signUp}>
            <text className={styles.submitButtonText}>Sign Up</text>
          </div>
        </div>
      </main>
    </>
  );
}