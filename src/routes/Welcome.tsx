import styles from "./styles/Welcome.module.scss";

export default function WelcomePage() {
  return (
    <>
      <main className={styles.main}>
        <text className={styles.title}>Welcome To Legera</text>
        <div className={styles.buttonContainer}>
          <div className={styles.inlineContainer}>
            <div className={styles.button}>
              <text className={styles.buttonText}>Log In</text>
            </div>
            <div className={styles.button}>
              <text className={styles.buttonText}>Sign Up</text>
            </div>
          </div>
          <text className={styles.orText}>or</text>
          <div className={styles.button}>
            <text className={styles.buttonText}>Google</text>
          </div>
        </div>
      </main>
    </>
  );
}