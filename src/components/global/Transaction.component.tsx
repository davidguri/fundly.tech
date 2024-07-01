import styles from "./styles/Transaction.module.scss";

import { IoTrash } from "react-icons/io5";

export default function Transaction(props: any) {

  function isInt(n: number): boolean {
    return n % 1 === 0;
  }

  return (
    <main className={styles.main}>
      <div className={styles.topContainer}>
        <div className={styles.tLeftContainer}>
          <text className={styles.subtitle}>{props.date}</text>
        </div>
        <div className={styles.tRightContainer} onClick={props.onDelete}>
          <IoTrash className={styles.subtitle} size={24} style={{ color: "#533fd5" }} />
        </div>
      </div>
      <div className={styles.bottomContainer}>
        <div className={styles.bLeftContainer}>
          <text className={styles.title}>{props.type}</text>
          <text className={styles.subtitle}>{props.name}{props.duration ? " - " + props.duration + " hours" : ""}</text>
        </div>
        <div className={styles.bRightContainer}>
          <text className={styles.title}>{props.incoming ? "+" : "-"} {isInt(props.amount) ? props.amount : (props.amount).toFixed(1)} {props.currency}</text>
          {
            props.tip ? (
              <text className={styles.subtitle}>+ <span style={{ fontSize: 12 }}>ALL</span> {props.tip} Tip</text>
            ) : (
              <div style={{ display: "none" }} />
            )
          }
        </div>
      </div>
    </main>
  )
}