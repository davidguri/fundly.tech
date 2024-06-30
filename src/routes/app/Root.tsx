import React from "react";
import styles from "./styles/Root.module.scss";
import Layout from "../../components/layout/Layout";
import { Link } from "react-router-dom";

import { IoCreate, IoCalendar, IoRepeat, IoWallet, IoSettings } from "react-icons/io5";

import { Firestore } from "../../controllers/firestore.controller";
import { getAuth } from "firebase/auth";

export default function Root() {

  const auth = getAuth()

  const [transactions, setTransactions] = React.useState([]);
  const [user, setUser]: any = React.useState([])

  const getUserData = async () => {
    try {
      const data = await Firestore.getUserById(auth.currentUser.uid)
      setUser(data)
      console.log(data)
      console.log(user.displayName)
    } catch (error: any) {
      alert(error.message)
    }
  }

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
    getUserData()
  }, []);

  const exchangeRates = {
    USD: {
      USD: 1,
      CAD: 1.25,
      GBP: 0.75,
      EUR: 0.85,
      ALL: 102.5,
    },
    CAD: {
      USD: 0.8,
      CAD: 1,
      GBP: 0.6,
      EUR: 0.68,
      ALL: 82,
    },
    GBP: {
      USD: 1.33,
      CAD: 1.67,
      GBP: 1,
      EUR: 1.13,
      ALL: 136.67,
    },
    EUR: {
      USD: 1.18,
      CAD: 1.47,
      GBP: 0.88,
      EUR: 1,
      ALL: 120.85,
    },
    ALL: {
      USD: 0.0098,
      CAD: 0.0122,
      GBP: 0.0073,
      EUR: 0.0083,
      ALL: 1,
    }
  };

  function convertCurrency(fromCurrency, toCurrency, amount) {
    const rate = exchangeRates[fromCurrency][toCurrency];
    const convertedAmount = amount * rate;
    return convertedAmount;
  }


  const getTotal = () => {
    let totalPay = 0
    let newTotalPay = 0;
    transactions.forEach((transaction) => {
      if (transaction.currency !== user.currency) {
        const newAmount = convertCurrency(transaction.currency, user.currency, transaction.amount);
        const newTip = convertCurrency(transaction.currency, user.currency, transaction.tip);
        newTotalPay += newAmount + newTip
      } else {
        totalPay += transaction.amount + transaction.tip
      }
    })
    return totalPay + newTotalPay
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
    let newMonthlyPay = 0;

    currentMonthTransactions.forEach((transaction) => {
      if (transaction.currency !== user.currency) {
        const newAmount = convertCurrency(transaction.currency, user.currency, transaction.amount);
        const newTip = convertCurrency(transaction.currency, user.currency, transaction.tip);
        newMonthlyPay += newAmount + newTip
      } else {
        monthlyPay += transaction.amount + transaction.tip
      }
    })
    return monthlyPay + newMonthlyPay;
  }

  return (
    <>
      <Layout>
        <main className={styles.main}>
          <section className={styles.topSection}>
            <div className={styles.titleContainer}>
              <text className="title"><span style={{ fontSize: 32 }}>{user.currency || "ALL"}</span> {getTotal()}</text>
              <text className="subtitle">Current Month: <span style={{ fontSize: 18, fontWeight: "900" }}>{user.currency || "ALL"}</span> {getMonthly()}</text>
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