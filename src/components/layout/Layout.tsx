import styles from "./Layout.module.scss";

export default function Layout({ children }) {
  return (
    <>
      <section className={styles.content}>
        {children}
      </section>
      <section className={styles.footer}></section>
    </>
  );
}