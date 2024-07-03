import React from "react";
import styles from "./styles/Root.module.scss";
import Layout from "../../components/layout/Layout";
import { Link } from "react-router-dom";

import { IoCreate, IoCalendar, IoRepeat, IoWallet, IoSettings, IoPeople } from "react-icons/io5";

import { getAuth } from "firebase/auth";

import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";

export default function Root() {

  const auth = getAuth()

  const [expenses, setExpenses] = React.useState([]);
  const [transactions, setTransactions] = React.useState([]);
  const [user, setUser]: any = React.useState([])

  const getUserData = async () => {

    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      setUser(docSnap.data())
      return docSnap.data()
    } else {
      alert("❌ No such document user!");
    }
  }

  const getExpenses = async () => {
    try {
      setExpenses([])
      const q = query(
        collection(db, "expenses"),
        where("business", "==", auth.currentUser.uid)
      );

      // Execute the query
      const querySnapshot = await getDocs(q);

      // Map the results to an array of transaction objects
      const userTransactions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setExpenses(userTransactions)
    } catch (error: any) {
      alert("Error: " + error.message)
    }
  }

  const getTransactions = async () => {
    try {
      const userData = await getUserData()
      setTransactions([])
      const q = query(collection(db, "transactions"), where("business", "==", userData.business));

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        ...doc.data()
      }))

      const filteredTransactions = data.filter(transaction => {
        return transaction.name === userData.displayName
      })

      setTransactions(filteredTransactions)
      // console.log(transactions)
    } catch (error: any) {
      alert("Error: " + error.message)
    }
  }

  React.useEffect(() => {
    getExpenses()
    getTransactions()
  }, [])


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

  function convertCurrency(fromCurrency: string, toCurrency: string, amount: number): number {
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
    return parseFloat((totalPay + newTotalPay).toFixed(2));
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

  const currentMonthExpenses = filterCurrentMonthTransactions(expenses);

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
    return parseFloat((monthlyPay + newMonthlyPay).toFixed(2));
  }

  const getMonthlyExpenses = () => {
    let monthlyExpenses = 0;
    currentMonthExpenses.forEach((expense) => {
      monthlyExpenses += convertCurrency(expense.currency, user.currency, expense.amount)
    })

    return parseFloat((monthlyExpenses).toFixed(2));
  }

  return (
    <>
      <Layout>
        <main className={styles.main}>
          <section className={styles.topSection}>
            <div className={styles.titleContainer}>
              <text className="title">{getTotal()} <span style={{ fontSize: 32 }}>{user.currency || "ALL"}</span></text>
              <text className="subtitle">Current Month: {getMonthly() - getMonthlyExpenses()} <span style={{ fontSize: 18, fontWeight: "900" }}>{user.currency || "ALL"}</span></text>
            </div>
          </section>
          <section className={styles.bottomSection}>
            <Link to="/wallet" className={`${styles.buttonContainer} ${"link"}`}>
              <div className={styles.buttonContainer}>
                <IoWallet className={styles.buttonIcon} />
              </div>
            </Link>
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
            {user.role === "Owner" ? (
              <Link to="/team" className={`${styles.buttonContainer} ${"link"}`}>
                <div className={styles.buttonContainer}>
                  <IoPeople className={styles.buttonIcon} />
                </div>
              </Link>
            ) : (
              <div style={{ display: "none" }} />
            )}
          </section>
        </main>
      </Layout>
    </>
  );
}