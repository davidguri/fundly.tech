import React from "react";
import { IoBusiness, IoPeople, IoPerson } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import styles from "./styles/Signup.module.scss";

export default function Signup() {
  const nav = useNavigate();

  const [selected, setSelected] = React.useState("-");

  const handleChangeSelected = (id: string) => {
    setSelected(id);
  };

  const handleContinue = () => {
    nav(`/info?type=${selected}`);
  };

  return (
    <>
      <main className={styles.main}>
        <text className={styles.title}>Let's Get Started!</text>
        <text className={styles.subtitle}>
          The custom tool to manage your business' cash payments!
        </text>
        <section className={styles.selectSection}>
          <div
            className={`${styles.selectContainer} ${selected === "0" && styles.selectedContainer}`}
            onClick={() => handleChangeSelected("0")}
          >
            <IoBusiness size={32} className={styles.selectTitle} />
            <text className={styles.selectTitle}>Owner</text>
          </div>
          <div
            className={`${styles.selectContainer} ${selected === "1" && styles.selectedContainer}`}
            onClick={() => handleChangeSelected("1")}
          >
            <IoPeople size={32} className={styles.selectTitle} />
            <text className={styles.selectTitle}>Worker</text>
          </div>
          <div
            className={`${styles.selectContainer} ${selected === "2" && styles.selectedContainer}`}
            onClick={() => handleChangeSelected("2")}
          >
            <IoPerson size={32} className={styles.selectTitle} />
            <text className={styles.selectTitle}>Freelance</text>
          </div>
        </section>
        <div className={styles.submitButton} onClick={handleContinue}>
          <text className={styles.submitButtonText}>Continue</text>
        </div>
        <text className={styles.alternativeText}>
          Already have an account?{" "}
          <span
            className="specialText"
            style={{ fontWeight: "800" }}
            onClick={() => nav("/login")}
          >
            Log In.
          </span>
        </text>
      </main>
    </>
  );
}
