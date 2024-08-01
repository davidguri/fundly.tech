import React from "react";
import styles from "./styles/Calendar.module.scss";
import Layout from "../../components/layout/Layout";

import { useNavigate } from "react-router-dom";
import { IoChevronBack, IoChevronForward, IoToday } from "react-icons/io5";

import { Calendar as CalendarComponent } from "react-calendar";
import Transaction from "../../components/global/Transaction.component";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import { auth } from "../../../firebase";

import { differenceInCalendarDays, differenceInCalendarMonths } from "date-fns";

import Loader from "../../components/global/Loader.component";

import { Transaction as TransactionModel } from "../../models/transaction.model";

export default function Calendar() {
  const nav = useNavigate();

  const [value, setValue] = React.useState<any>(new Date());

  const [loading, setLoading] = React.useState(true);
  const [workerTransactions, setWorkerTransactions] = React.useState([]);

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

  let monthsLong = [
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
    days[dt.getDay()] +
    ", " +
    dt.getDate() +
    nth(dt.getDate()) +
    " " +
    months[dt.getMonth()];

  let resultDate =
    days[value.getDay()] +
    ", " +
    value.getDate() +
    nth(value.getDate()) +
    " " +
    months[value.getMonth()];

  const userLocal = JSON.parse(localStorage.getItem("userData"));
  // console.log(user.displayName);

  const [transactions, setTransactions] = React.useState([]);

  async function getTransactions() {
    try {
      setTransactions([]);
      const q1 = query(
        collection(db, "transactions"),
        where("business", "==", userLocal.business),
      );

      const q2 = query(
        collection(db, "transactions"),
        where("business", "==", auth.currentUser.uid),
      );

      const [querySnapshot1, querySnapshot2] = await Promise.all([
        getDocs(q1),
        getDocs(q2),
      ]);

      const transactions1 = querySnapshot1.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const transactions2 = querySnapshot2.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const combinedTransactions = [...transactions1, ...transactions2].reduce(
        (acc, transaction) => {
          if (!acc.find((t) => t.id === transaction.id)) {
            acc.push(transaction);
          }
          return acc;
        },
        [],
      );

      const filteredTransactions = combinedTransactions.filter(
        (transaction) => {
          return transaction.name === auth.currentUser.displayName;
        },
      );

      const workerTransactions = combinedTransactions.filter((transaction) => {
        return transaction.name !== auth.currentUser.displayName;
      });

      setTransactions(filteredTransactions);
      setWorkerTransactions(workerTransactions);
      setLoading(false);
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  }

  React.useEffect(() => {
    getTransactions();
  }, []);

  const [rate, setRate] = React.useState<any>();

  const getRate = (toCurrency: string): any => {
    fetch(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${userLocal.currency.toLowerCase()}.json`,
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        setRate(
          data[`${userLocal.currency.toLowerCase()}`][
            `${toCurrency.toLowerCase()}`
          ],
        );
      });
  };

  function convertCurrency(toCurrency: string, amount: number): number {
    getRate(toCurrency);
    const convertedAmount = amount / rate;
    return convertedAmount;
  }

  const [currentMonth, setCurrentMonth] = React.useState<Date>(value);

  function getMonthTransactions(date: any) {
    console.log(transactions);
    const monthTransactions = transactions.filter((transaction) => {
      const timestamp = new Date(transaction.date.seconds * 1000);
      console.log(timestamp.getMonth());
      console.log(date.getMonth());
      if (
        timestamp.getMonth() === date.getMonth() &&
        timestamp.getFullYear() === date.getFullYear()
      ) {
        console.log(transaction);
        return transaction;
      }
    });
    return monthTransactions;
  }

  function getTotalMonth(date: any) {
    const monthTransactions = getMonthTransactions(date);
    let totalPay = 0;
    let newTotalPay = 0;
    monthTransactions.forEach((transaction) => {
      if (transaction.currency !== userLocal.currency) {
        const newAmount = convertCurrency(
          transaction.currency,
          parseFloat(transaction.amount),
        );
        const newTip = convertCurrency(
          transaction.currency,
          parseFloat(transaction.tip),
        );
        newTotalPay += newAmount + newTip;
      } else {
        totalPay +=
          parseFloat(transaction.amount) + parseFloat(transaction.tip);
      }
    });
    return parseFloat((totalPay + newTotalPay).toFixed(2));
  }

  function isSameMonth(a: any, b: any) {
    return differenceInCalendarMonths(a, b) === 0;
  }

  function isSameDay(a: any, b: Date) {
    return differenceInCalendarDays(a, b) === 0;
  }

  function tileClass({ date }) {
    const today = new Date();
    if (isSameMonth(date, value)) {
      return isSameDay(date, value) ? styles.tileCurrent : styles.tile;
    } else if (isSameDay(date, today)) {
      return styles.currentDay;
    } else {
      return styles.inactiveTile;
    }
  }

  const groupTransactionsByName = (transactions: TransactionModel[]) => {
    return transactions.reduce((acc, transaction) => {
      const { name } = transaction;
      if (!acc[name]) {
        acc[name] = [];
      }
      acc[name].push(transaction);
      return acc;
    }, {});
  };

  function formatNumber(number: number) {
    if (number % 1 === 0) {
      return number.toString();
    } else {
      return number.toFixed(2);
    }
  }

  function filterCurrentMonthTransactions(transactions: any) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const filteredTransactions = transactions.filter((transaction: any) => {
      const date = new Date(transaction.date.seconds * 1000);
      const transactionMonth = date.getMonth();
      const transactionYear = date.getFullYear();

      return (
        transactionMonth === currentMonth && transactionYear === currentYear
      );
    });

    return filteredTransactions;
  }

  const currentMonthWorkerTransactions =
    filterCurrentMonthTransactions(workerTransactions);

  const getTransactionsByName = (transactions: any[], name: string) => {
    let amount = 0;
    transactions.forEach((transaction) => {
      if (transaction.name === name) {
        amount +=
          convertCurrency(
            transaction.currency,
            parseFloat(transaction.amount),
          ) +
          convertCurrency(transaction.currency, parseFloat(transaction.tip));
      }
    });

    return parseFloat(amount.toFixed(2));
  };

  return (
    <>
      <Layout>
        <main className={styles.main}>
          <div className={styles.titleContainer}>
            <div className={styles.leftTitleContainer}>
              <div onClick={() => nav(-1)}>
                <IoChevronBack className="title" color="#533fd5" />
              </div>
              <text className="title">{date}</text>
            </div>
            <div
              style={{ textDecoration: "none", color: "inherit" }}
              onClick={() => setValue(new Date())}
            >
              <IoToday className="title" color="#533fd5" size={30} />
            </div>
          </div>
          <div className={styles.calendarContainer}>
            <div
              className={styles.overlay}
              style={{
                display: `${currentMonth.getMonth() !== value.getMonth() ? "flex" : "none"}`,
              }}
            >
              <text className={styles.overlayText}>
                {getTotalMonth(currentMonth)} {userLocal.currency}
              </text>
            </div>
            <CalendarComponent
              onChange={(value) => {
                setValue(value);
                getTransactions();
                getTotalMonth(value);
              }}
              value={value}
              view="month"
              className={styles.calendar}
              showNavigation={true}
              tileClassName={tileClass}
              nextLabel={
                <IoChevronForward
                  style={{ margin: 0, padding: 0 }}
                  size={18}
                  color="#533fd5"
                />
              }
              prevLabel={
                <IoChevronBack
                  style={{ margin: 0, padding: 0 }}
                  size={18}
                  color="#533fd5"
                />
              }
              onActiveStartDateChange={({ activeStartDate, value }) => {
                setValue(value);
                setCurrentMonth(activeStartDate);
                getTransactions();
                getTotalMonth(activeStartDate);
              }}
            />
          </div>
          <div className={styles.content}>
            {currentMonth.getMonth() === value.getMonth() ? (
              <text className={styles.title}>Activity for {resultDate}:</text>
            ) : (
              <text className={styles.title}>
                Activity for {monthsLong[currentMonth.getMonth()]}
              </text>
            )}
            {loading ? (
              <Loader />
            ) : currentMonth.getMonth() === value.getMonth() ? (
              transactions
                .filter((transaction) => {
                  const timestamp = new Date(transaction.date.seconds * 1000);
                  console.log(timestamp.getMonth());
                  console.log(value.getMonth());
                  if (
                    timestamp.getMonth() === value.getMonth() &&
                    timestamp.getDate() === value.getDate() &&
                    timestamp.getFullYear() === value.getFullYear()
                  ) {
                    return transaction;
                  }
                })
                .map((transaction, i) => {
                  return (
                    <>
                      <Transaction
                        key={i}
                        incoming={transaction.incoming}
                        date={transaction.date.seconds * 1000}
                        type={transaction.type}
                        name={transaction.name}
                        amount={transaction.amount}
                        tip={transaction.tip}
                        duration={transaction.duration}
                        currency={transaction.currency}
                      />
                    </>
                  );
                })
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {transactions && (
                  <div className={styles.transaction}>
                    <text className={styles.transactionText}>You</text>
                    <text
                      className={styles.transactionText}
                      style={{ color: "#533fd5" }}
                    >
                      {getTotalMonth(currentMonth)} {userLocal.currency}
                    </text>
                  </div>
                )}
                {Object.keys(groupTransactionsByName(workerTransactions)).map(
                  (name) => (
                    <div className={styles.transaction} key={name}>
                      <text className={styles.transactionText}>{name}</text>
                      <text
                        className={styles.transactionText}
                        style={{ color: "#533fd5" }}
                      >
                        {formatNumber(
                          getTransactionsByName(
                            currentMonthWorkerTransactions,
                            name,
                          ),
                        )}{" "}
                        {userLocal.currency}
                      </text>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        </main>
      </Layout>
    </>
  );
}
