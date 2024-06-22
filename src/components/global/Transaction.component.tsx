import styles from "./styles/Transaction.module.scss";

import { IoCaretForward, IoCaretBack } from "react-icons/io5";

export default function Transaction(props: any) {
  return (
    <main className={styles.main}>
      <div className={styles.topContainer}>
        {
          props.incoming ? (
            <IoCaretForward className={styles.subtitle} size={21} />
          ) : (
            <IoCaretBack className={styles.subtitle} size={21} />
          )
        }
        <text className={styles.subtitle}>{props.date}</text>
      </div>
      <div className={styles.bottomContainer}>
        <div className={styles.bLeftContainer}>
          <text className={styles.title}>{props.type}</text>
          <text className={styles.subtitle}>{props.name}</text>
        </div>
        <div className={styles.bRightContainer}>
          <text className={styles.title}>{props.amount}</text>
        </div>
      </div>
    </main>
  )
}