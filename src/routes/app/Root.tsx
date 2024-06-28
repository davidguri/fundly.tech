import React from "react";
import styles from "./styles/Root.module.scss";
import Layout from "../../components/layout/Layout";
import { Link } from "react-router-dom";

import { IoCreate, IoCalendar, IoRepeat, IoWallet, IoSettings } from "react-icons/io5";

import { Firestore } from "../../controllers/firestore.controller";
import { auth } from "../../../firebase";

export default function Root() {

  const [transactions, setTransactions] = React.useState([]);

  React.useEffect(() => {
    const getTransactions = async () => {
      try {
        setTransactions([])
        const data = await Firestore.getTransactions(auth.currentUser.uid)
        setTransactions(data)
      } catch (error: any) {
        alert(error.message)
      }
    }

    getTransactions()
  }, []);

  const getTotal = () => {
    let totalPay = 0
    transactions.forEach((transaction) => {
      totalPay += transaction.amount + transaction.tip
    })
    return totalPay
  }

  function filterCurrentMonthTransactions(transactions: any) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const filteredTransactions = transactions.filter(transaction => {
      const date = new Date(transaction.date.seconds * 1000);
      const transactionMonth = date.getMonth();
      const transactionYear = date.getFullYear();

      return transactionMonth === currentMonth && transactionYear === currentYear;
    });

    return filteredTransactions;
  }

  const currentMonthTransactions = filterCurrentMonthTransactions(transactions);

  const getMonthly = () => {
    let monthlyPay = 0

    currentMonthTransactions.forEach((transaction) => {
      monthlyPay += transaction.amount + transaction.tip
    })
    return monthlyPay;
  }

  return (
    <>
      <Layout>
        <main className={styles.main}>
          <section className={styles.topSection}>
            <div className={styles.titleContainer}>
              <text className="title"><span style={{ fontSize: 32 }}>ALL</span> {getTotal()}</text>
              <text className="subtitle">Current Month: <span style={{ fontSize: 18 }}>ALL</span> {getMonthly()}</text>
            </div>
          </section>
          <section className={styles.bottomSection}>
            <div className={styles.buttonContainer}>
              <IoWallet className={styles.buttonIcon} />
            </div>
            <div className={styles.buttonContainer}>
              <IoCalendar className={styles.buttonIcon} />
            </div>
            <Link to="/settings" className={`${styles.buttonContainer} ${"link"}`}>
              <div className={styles.buttonContainer}>
                <IoSettings className={styles.buttonIcon} />
              </div>
            </Link>
            <Link to="/transactions" className={`${styles.buttonContainer} ${"link"}`}>
              <div className={styles.buttonContainer}>
                <IoRepeat className={styles.buttonIcon} />
              </div>
            </Link>
            <Link to="/add" className={`${styles.buttonContainer} ${"link"}`}>
              <div className={styles.buttonContainer}>
                <IoCreate className={styles.buttonIcon} />
              </div>
            </Link>
          </section>
        </main>
      </Layout>
    </>
  );
}