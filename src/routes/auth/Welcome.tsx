import styles from "./styles/Welcome.module.scss";
import { Link } from "react-router-dom";

export default function WelcomePage() {
  return (
    <>
      <main className={styles.main}>
        <div className={styles.titleContainer}>
          <text className={styles.title}>Welcome To Fundly!</text>
          <text className={styles.subtitle}>The custom tool to manage your business' cash payments!</text>
        </div>
        <div className={styles.buttonContainer}>
          <Link to="/signup" className="link" style={{ width: "100%" }}>
            <div className={styles.button} style={{ backgroundColor: "#533fd5" }}>
              {/* <IoEnter className={styles.buttonText} size={28} /> */}
              <text className={styles.buttonText}>Let's Get Started</text>
            </div>
          </Link>
          <Link to="/login" className="link" style={{ width: "100%" }}>
            <div className={styles.button} style={{ backgroundColor: "#0a0a0f" }}>
              {/* <IoEnter className={styles.buttonText} size={28} /> */}
              <text className={styles.buttonText}>Log Back In</text>
            </div>
          </Link>
        </div>
      </main>
    </>
  );
}