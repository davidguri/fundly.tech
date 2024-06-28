import styles from "./styles/Transaction.module.scss";

import { IoCaretForward, IoCaretBack } from "react-icons/io5";

export default function Transaction(props: any) {

  function isInt(n: number): boolean {
    return n % 1 === 0;
  }

  return (
    <main className={styles.main}>
      <div className={styles.topContainer}>
        {
          props.incoming ? (
            <IoCaretForward className={styles.subtitle} size={21} style={{ color: "#533fd5" }} />
          ) : (
            <IoCaretBack className={styles.subtitle} size={21} style={{ color: "#533fd5" }} />
          )
        }
        <text className={styles.subtitle}>{props.date}</text>
      </div>
      <div className={styles.bottomContainer}>
        <div className={styles.bLeftContainer}>
          <text className={styles.title}>{props.type}</text>
          <text className={styles.subtitle}>{props.name} - {props.duration} hours</text>
        </div>
        <div className={styles.bRightContainer}>
          <text className={styles.title}>${isInt(props.amount) ? props.amount : (props.amount).toFixed(1)}</text>
          {
            props.tip ? (
              <text className={styles.subtitle}>+ ${props.tip} Tip</text>
            ) : (
              <div style={{ display: "none" }} />
            )
          }
        </div>
      </div>
    </main>
  )
}