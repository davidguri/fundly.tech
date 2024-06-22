import styles from "./styles/Welcome.module.scss";

import { IoLogoGoogle } from "react-icons/io5";

export default function WelcomePage() {
  return (
    <>
      <main className={styles.main}>
        <text className={styles.title}>Welcome To Legera!</text>
        <div className={styles.buttonContainer}>
          <div className={styles.button} style={{ backgroundColor: "#aea9cb" }}>
            <text className={styles.buttonText}>Log In</text>
          </div>
          <div className={styles.button} style={{ backgroundColor: "#443e6f" }}>
            <text className={styles.buttonText}>Sign Up</text>
          </div>
          <text className={styles.orText}>or</text>
          <div className={styles.button} style={{ backgroundColor: "#533fd5" }}>
            <IoLogoGoogle className={styles.buttonText} />
            <text className={styles.buttonText}>Continue With Google</text>
          </div>
        </div>
      </main>
    </>
  );
}