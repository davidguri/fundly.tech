// import React from "react";
import styles from "./styles/Loader.module.scss";

export default function Loader() {
  return (
    <main className={styles.spinnerContainer}>
      <div className={styles.spinner} />
    </main>
  );
}