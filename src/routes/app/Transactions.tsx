import React from "react";
import styles from "./styles/Transactions.module.scss";
import Layout from "../../components/layout/Layout";

import { useNavigate } from "react-router-dom";

import Transaction from "../../components/global/Transaction.component";

import { IoChevronBack } from "react-icons/io5";
import { Firestore } from "../../controllers/firestore.controller";
import { auth } from "../../../firebase";

export default function Transactions() {

  const nav = useNavigate();

  const [transactions, setTransactions] = React.useState([])

  React.useEffect(() => {
    const getTransactions = async () => {
      try {
        setTransactions([])
        const data = await Firestore.getTransactions(auth.currentUser.uid)
        setTransactions(data)
        console.log(data)
      } catch (error: any) {
        alert(error.message)
      }
    }

    getTransactions()
  }, []);

  function formatTimestamp(timestamp) {
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


  return (
    <>
      <Layout>
        <main className={styles.main}>
          <div className={styles.titleContainer}>
            <div onClick={() => nav(-1)}>
              <IoChevronBack className="title" color="#533fd5" />
            </div>
            <text className="title">All Activity</text>
          </div>
          <div className={styles.transactionsContainer}>
            {transactions.map((transaction, i) => {
              const date = new Date(transaction.date.seconds * 1000)
              const formattedDate = formatTimestamp(date);
              return (
                <Transaction key={i} incoming={true} date={formattedDate} type={transaction.type} name={transaction.name} amount={transaction.amount} tip={transaction.tip} duration={transaction.duration} />
              )
            })}
          </div>
        </main>
      </Layout>
    </>
  )
}