import React from "react";
import styles from "./styles/Calendar.module.scss";
import Layout from "../../components/layout/Layout";

import { useNavigate } from "react-router-dom"
import { IoChevronBack, IoChevronForward, IoHelpCircle, IoCheckmarkCircle } from "react-icons/io5"

import { Calendar as CalendarComponent } from 'react-calendar';
import Transaction from "../../components/global/Transaction.component";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import { Firestore } from "../../controllers/firestore.controller";
import { auth } from "../../../firebase";

import { differenceInCalendarDays, differenceInCalendarMonths } from 'date-fns';

export default function Calendar() {

  const nav = useNavigate();

  const [value, setValue] = React.useState<any>(new Date());

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

  let resultDate = days[value.getDay()] + ", " + value.getDate() + nth(value.getDate()) + " " + months[value.getMonth()];

  function formatTimestamp(timestamp: any) {
    const date = new Date(timestamp);

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayName = days[date.getDay()];

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    const monthName = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    const formattedDate = `${dayName} @ ${hours}:${minutes} ${ampm}, ${monthName} ${day}, ${year}`;
    return formattedDate;
  }

  const [user, setUser]: any = React.useState([])
  console.log(user.displayName)

  const getUserData = async () => {
    const data = await Firestore.getUserById(auth.currentUser.uid)
    setUser(data);
    return data
  }

  const [transactions, setTransactions] = React.useState([]);

  const getTransactions = async (date: any) => {
    try {
      const userData = await getUserData()
      setTransactions([])
      if (userData.role === "Worker") {
        const q = query(collection(db, "transactions"), where("name", "==", userData.displayName));

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          ...doc.data()
        }))

        const filteredTransactions = data.filter((transaction) => {
          const timestamp = new Date(transaction.date.seconds * 1000)
          if (timestamp.getMonth() === date.getMonth() && timestamp.getDate() === date.getDate() && timestamp.getFullYear() === date.getFullYear()
          ) {
            return transaction
          }
        })

        const sortedTransactions = filteredTransactions.sort((a, b) => b.date - a.date)

        setTransactions(sortedTransactions)
      } else {
        const q1 = query(collection(db, "transactions"), where("business", "==", userData.business));

        const q2 = query(collection(db, "transactions"), where("business", "==", userData.id));

        const [querySnapshot1, querySnapshot2] = await Promise.all([getDocs(q1), getDocs(q2)]);

        // Combine the results
        const transactions1 = querySnapshot1.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const transactions2 = querySnapshot2.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Combine the two arrays and remove duplicates
        const combinedTransactions = [...transactions1, ...transactions2].reduce((acc, transaction) => {
          if (!acc.find(t => t.id === transaction.id)) {
            acc.push(transaction);
          }
          return acc;
        }, []);

        const filteredTransactions = combinedTransactions.filter((transaction) => {
          const timestamp = new Date(transaction.date.seconds * 1000)
          if (timestamp.getMonth() === date.getMonth() && timestamp.getDate() === date.getDate() && timestamp.getFullYear() === date.getFullYear()
          ) {
            return transaction
          }
        })

        const sortedTransactions = filteredTransactions.sort((a, b) => b.date - a.date)

        setTransactions(sortedTransactions)
      }
      // console.log(transactions)
    } catch (error: any) {
      alert("Error: " + error.message)
    }
  }

  React.useEffect(() => {
    getTransactions(value)
  }, [])

  const handleDelete = async (id: string, type: string) => {
    setShow(false)
    if (type === "expenses") {
      await Firestore.deleteExpense(id)
    } else {
      await Firestore.deleteTransaction(id)
    }
    getTransactions(value)
  }

  function isSameMonth(a, b) {
    return differenceInCalendarMonths(a, b) === 0
  }

  function isSameDay(a, b) {
    return differenceInCalendarDays(a, b) === 0
  }

  function tileClass({ date }) {
    const today = new Date()
    if (isSameMonth(date, value)) {
      return isSameDay(date, value) ? styles.tileCurrent : styles.tile
    } else if (isSameDay(date, today)) {
      return styles.currentDay
    } else {
      return styles.inactiveTile
    }
  }

  const [show, setShow] = React.useState(false);
  const status = "question"

  const [rate, setRate] = React.useState<number>()

  function convertCurrency(fromCurrency: string, toCurrency: string, amount: number): number {
    fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurrency.toLowerCase()}.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        const rate = data[`${fromCurrency.toLowerCase()}`][`${toCurrency.toLowerCase()}`];
        setRate(rate)
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
    const convertedAmount = amount * rate;
    return convertedAmount;
  }

  const [currentMonth, setCurrentMonth] = React.useState<any>(value)

  function getTotalMonth(date: any) {
    const monthTransactions = transactions.filter((transaction) => {
      const timestamp = new Date(transaction.date.seconds * 1000)
      if (timestamp.getMonth() === date.getMonth() && timestamp.getFullYear() === date.getFullYear()
      ) {
        return transaction
      }
    })
    let totalPay = 0
    let newTotalPay = 0;
    monthTransactions.forEach((transaction) => {
      if (transaction.currency !== user.currency) {
        const newAmount = convertCurrency(transaction.currency, user.currency, parseFloat(transaction.amount));
        const newTip = convertCurrency(transaction.currency, user.currency, parseFloat(transaction.tip));
        newTotalPay += newAmount + newTip
      } else {
        totalPay += parseFloat(transaction.amount) + parseFloat(transaction.tip)
      }
    })
    return parseFloat((totalPay + newTotalPay).toFixed(2));
  }

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
          <div className={styles.calendarContainer}>
            <div className={styles.overlay} style={{ display: `${currentMonth.getMonth() !== value.getMonth() ? "flex" : "none"}` }}>
              <text className={styles.overlayText}>{getTotalMonth(currentMonth)} {user.currency}</text>
            </div>
            <CalendarComponent
              onChange={(value) => { setValue(value); getTransactions(value) }}
              value={value}
              view="month"
              className={styles.calendar}
              showNavigation={true}
              tileClassName={tileClass}
              nextLabel={<IoChevronForward style={{ margin: 0, padding: 0 }} size={18} color="#533fd5" />}
              prevLabel={<IoChevronBack style={{ margin: 0, padding: 0 }} size={18} color="#533fd5" />}
              onActiveStartDateChange={({ activeStartDate }) => { setCurrentMonth(activeStartDate); console.log(activeStartDate); }}
            />
          </div>
          <div className={styles.content}>
            <text className={styles.title}>Activity for {resultDate}:</text>
            {transactions.map((transaction, i) => {
              const date = new Date(transaction.date.seconds * 1000)
              const formattedDate = formatTimestamp(date);
              return (
                <>
                  <section className={styles.footer} style={{ display: `${show ? "flex" : "none" || "none"}` }}>
                    <div className={styles.footerTopContainer}>
                      <text className={styles.footerTitle}>{status === "question" ? "Confirm Operation?" : "Success!"}</text>
                      <text className={styles.footerSubtitle}>{status === "question" ? "Are you sure you want to continue?" : "Operation completed successfully!"}</text>
                    </div>
                    <div className={styles.footerMiddleContainer}>
                      {
                        status === "question" ? (
                          <IoHelpCircle size={104} color="#533fd5" />
                        ) : (
                          <IoCheckmarkCircle size={96} color="#533fd5" />
                        )
                      }
                    </div>
                    <div className={styles.footerBottomContainer}>
                      <div className={styles.footerButton} onClick={() => handleDelete(transaction.id, transaction.incoming ? "transactions" : "expenses")}>
                        <text className={styles.footerButtonText}>{status === "question" ? "Confirm" : "Done"}</text>
                      </div>
                      <text className={styles.footerCancelText} onClick={() => setShow(false)} style={{ color: "#533fd5" }}>Cancel</text>
                    </div>
                  </section>
                  <Transaction key={i} incoming={transaction.incoming} date={formattedDate} type={transaction.type} name={transaction.name} amount={transaction.amount} tip={transaction.tip} duration={transaction.duration} onDelete={() => setShow(true)} currency={transaction.currency} />
                </>
              )
            })}
          </div>
        </main>
      </Layout>
    </>
  )
}