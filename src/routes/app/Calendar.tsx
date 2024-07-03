import React from "react";
import styles from "./styles/Calendar.module.scss";
import Layout from "../../components/layout/Layout";

import { useNavigate } from "react-router-dom"
import { IoChevronBack } from "react-icons/io5"

import { Calendar as CalendarComponent } from 'react-calendar';
import Transaction from "../../components/global/Transaction.component";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import { Firestore } from "../../controllers/firestore.controller";
import { auth } from "../../../firebase";

export default function Calendar() {

  const nav = useNavigate();

  const [value, setValue] = React.useState<any>(new Date());
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
            console.log(transaction)
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

        console.log(combinedTransactions)

        const filteredTransactions = combinedTransactions.filter((transaction) => {
          const timestamp = new Date(transaction.date.seconds * 1000)
          if (timestamp.getMonth() === date.getMonth() && timestamp.getDate() === date.getDate() && timestamp.getFullYear() === date.getFullYear()
          ) {
            console.log(transaction)
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
    if (type === "expenses") {
      await Firestore.deleteExpense(id)
    } else {
      await Firestore.deleteTransaction(id)
    }
    getTransactions(value)
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
            <CalendarComponent onChange={(value) => { setValue(value); getTransactions(value) }} value={value} view="month" className={styles.calendar} showNavigation={false} tileClassName={styles.tile} />
          </div>
          <div className={styles.content}>
            <text className={styles.title}>Activity for {resultDate}</text>
            {transactions.map((transaction, i) => {
              const date = new Date(transaction.date.seconds * 1000)
              const formattedDate = formatTimestamp(date);
              return (
                <Transaction key={i} incoming={transaction.incoming} date={formattedDate} type={transaction.type} name={transaction.name} amount={transaction.amount} tip={transaction.tip} duration={transaction.duration} onDelete={() => handleDelete(transaction.id, transaction.incoming ? "transactions" : "expenses")} currency={transaction.currency} />
              )
            })}
          </div>
        </main>
      </Layout>
    </>
  )
}