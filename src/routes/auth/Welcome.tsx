import styles from "./styles/Welcome.module.scss";

import { IoEnter } from "react-icons/io5";

export default function WelcomePage() {
  return (
    <>
      <main className={styles.main}>
        <text className={styles.title}>Welcome To Legera!</text>
        <div className={styles.buttonContainer}>
          <a href="/signup" className="link" style={{ width: "100%" }}>
            <div className={styles.button} style={{ backgroundColor: "#533fd5" }}>
              <IoEnter className={styles.buttonText} size={28} />
              <text className={styles.buttonText}>Let's Get Started</text>
            </div>
          </a>
          <text className={styles.orText}>Already have an account? <a href="/login" className="link" style={{ color: "#533fd5" }}>Log in</a>.</text>
        </div>
      </main>
    </>
  );
}