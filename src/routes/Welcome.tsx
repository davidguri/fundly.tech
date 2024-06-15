import styles from "./styles/Welcome.module.scss";

export default function WelcomePage() {
  return (
    <>
      <main className={styles.main}>
        <text style={{ color: "white" }}>Welcome</text>
      </main>
    </>
  );
}