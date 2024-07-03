import React from "react";
import styles from "./styles/Calendar.module.scss";
import Layout from "../../components/layout/Layout";

import { useNavigate } from "react-router-dom"
import { IoChevronBack } from "react-icons/io5"

import { Calendar as CalendarComponent } from 'react-calendar';

export default function Calendar() {

  const nav = useNavigate();

  type ValuePiece = Date | null;

  type Value = ValuePiece | [ValuePiece, ValuePiece];

  const [value, setValue] = React.useState<Value>(new Date());
  console.log(value);

  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const nth = function (d: number) {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let dt = new Date();
  let date =
    days[dt.getDay()] + ", " + dt.getDate() + nth(dt.getDate()) + " " + months[dt.getMonth()];

  return (
    <>
      <Layout>
        <main className={styles.main}>
          <div className={styles.titleContainer}>
            <div onClick={() => nav(-1)}>
              <IoChevronBack className="title" color="#533fd5" />
            </div>
            <text className="title">{date}</text>
          </div>
          <div className={styles.calendar}>
            <CalendarComponent onChange={setValue} value={value} view="month" className={styles.calendar} showNavigation={false} />
          </div>
        </main>
      </Layout>
    </>
  )
}