import React from "react";
import styles from "./styles/Transactions.module.scss";
import Layout from "../../components/layout/Layout";

import { useNavigate } from "react-router-dom";

import Transaction from "../../components/global/Transaction.component";

import { IoChevronBack, IoRefresh } from "react-icons/io5";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import { Firestore } from "../../controllers/firestore.controller";
import { auth } from "../../../firebase";

export default function Transactions() {

  const nav = useNavigate();

  const [transactions, setTransactions] = React.useState([])

  const getUserData = async () => {
    const data = await Firestore.getUserById(auth.currentUser.uid)
    return data
  }

  const getTransactions = async () => {
    try {
      const userData = await getUserData()
      setTransactions([])
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

      setTransactions(combinedTransactions)
      // console.log(transactions)
    } catch (error: any) {
      alert("Error: " + error.message)
    }
  }

  React.useEffect(() => {
    getTransactions()
  }, []);

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

  const handleDelete = async (id: string) => {
    await Firestore.deleteTransaction(id)
    getTransactions()
  }

  return (
    <>
      <Layout>
        <main className={styles.main}>
          <div className={styles.titleContainer}>
            <div className={styles.titleLeftContainer}>
              <div onClick={() => nav(-1)}>
                <IoChevronBack className="title" color="#533fd5" />
              </div>
              <text className="title">All Activity</text>
            </div>
            <div onClick={getTransactions}>
              <IoRefresh className="title" color="#533fd5" size={32} />
            </div>
          </div>
          <div className={styles.transactionsContainer}>
            {transactions.map((transaction, i) => {
              const date = new Date(transaction.date.seconds * 1000)
              const formattedDate = formatTimestamp(date);
              return (
                <Transaction key={i} incoming={transaction.incoming} date={formattedDate} type={transaction.type} name={transaction.name} amount={transaction.amount} tip={transaction.tip} duration={transaction.duration} onDelete={() => handleDelete(transaction.id)} currency={transaction.currency} />
              )
            })}
          </div>
        </main>
      </Layout>
    </>
  )
}