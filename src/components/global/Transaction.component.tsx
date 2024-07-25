import styles from "./styles/Transaction.module.scss";

import { IoTrash } from "react-icons/io5";

export default function Transaction(props: any) {
  function isInt(n: number): boolean {
    return n % 1 === 0;
  }

  function formatTimestamp(timestamp: any) {
    const date = new Date(timestamp);

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dayName = days[date.getDay()];

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;

    const monthName = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    const formattedDate = `${dayName} @ ${hours}:${minutes} ${ampm}, ${monthName} ${day}, ${year}`;
    return formattedDate;
  }

  const date = new Date(props.date);
  const formattedDate = formatTimestamp(date);

  return (
    <main className={styles.main}>
      <div className={styles.topContainer}>
        <div className={styles.tLeftContainer}>
          <text className={styles.subtitle}>{formattedDate}</text>
        </div>
        {location.pathname !== "/calendar" && (
          <div className={styles.tRightContainer} onClick={props.onDelete}>
            <IoTrash
              className={styles.subtitle}
              size={24}
              style={{ color: "#533fd5" }}
            />
          </div>
        )}
      </div>
      <div className={styles.bottomContainer}>
        <div className={styles.bLeftContainer}>
          <text className={styles.title}>{props.type}</text>
          <text className={styles.subtitle}>
            {props.name}
            {props.duration ? " - " + props.duration + " hours" : ""}
          </text>
        </div>
        <div className={styles.bRightContainer}>
          <text className={styles.title}>
            {props.incoming ? "+" : "-"}{" "}
            {isInt(props.amount) ? props.amount : props.amount.toFixed(1)}{" "}
            {props.currency}
          </text>
          {props.tip ? (
            <text className={styles.subtitle}>
              + <span style={{ fontSize: 12 }}>ALL</span> {props.tip} Tip
            </text>
          ) : (
            <div style={{ display: "none" }} />
          )}
        </div>
      </div>
    </main>
  );
}
