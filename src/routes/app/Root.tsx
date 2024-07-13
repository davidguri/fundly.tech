import React from "react";
import styles from "./styles/Root.module.scss";
import Layout from "../../components/layout/Layout";
import { Link } from "react-router-dom";

import { IoCreate, IoCalendar, IoRepeat, IoWallet, IoSettings, IoStatsChart } from "react-icons/io5";

import { getAuth } from "firebase/auth";

import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";

export default function Root() {

  const auth = getAuth()

  const [expenses, setExpenses] = React.useState([]);
  const [transactions, setTransactions] = React.useState([]);
  const [user, setUser]: any = React.useState([])

  const [loading, setLoading] = React.useState(true);

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
      setLoading(false);
      // console.log(transactions)
    } catch (error: any) {
      alert("Error: " + error.message)
    }
  }

  React.useEffect(() => {
    setLoading(true)
    getExpenses()
    getTransactions()
  }, [])

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

  const getTotal = () => {
    let totalPay = 0
    let newTotalPay = 0;
    transactions.forEach((transaction) => {
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

  const getTotalExpenses = () => {
    let totalPay = 0
    let newTotalPay = 0;
    expenses.forEach((expense) => {
      if (expense.currency !== user.currency) {
        const newAmount = convertCurrency(expense.currency, user.currency, parseFloat(expense.amount));
        const newTip = convertCurrency(expense.currency, user.currency, parseFloat(expense.tip));
        newTotalPay += newAmount + newTip
      } else {
        totalPay += parseFloat(expense.amount) + parseFloat(expense.tip)
      }
    })
    return parseFloat((totalPay + newTotalPay).toFixed(2));
  } // TODO: MAKE A WEB WORKER FOR THESE TWO

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
        const newAmount = convertCurrency(transaction.currency, user.currency, parseFloat(transaction.amount));
        const newTip = convertCurrency(transaction.currency, user.currency, parseFloat(transaction.tip));
        newMonthlyPay += newAmount + newTip
      } else {
        monthlyPay += parseFloat(transaction.amount) + parseFloat(transaction.tip)
      }
    })
    return parseFloat((monthlyPay + newMonthlyPay).toFixed(2));
  }

  const getMonthlyExpenses = () => {
    let monthlyExpenses = 0;
    currentMonthExpenses.forEach((expense) => {
      monthlyExpenses += convertCurrency(expense.currency, user.currency, parseFloat(expense.amount))
    })

    return parseFloat((monthlyExpenses).toFixed(2));
  }

  function formatNumber(number) {
    if (number % 1 === 0) {
      return number.toString();
    } else {
      return number.toFixed(2);
    }
  }

  const hours = new Date().getHours();
  const greeting = hours >= 5 && hours < 12 ? "Morning" : hours >= 12 && hours < 18 ? "'Noon" : "Evening"

  return (
    <>
      <Layout>
        <main className={styles.main}>
          <section className={styles.topSection}>
            <div className={styles.greetingContainer}>
              <text className={styles.subtitle} style={{ lineHeight: 1 }}>Good {greeting}, {user.displayName}!</text>
              {/* <img src={user.photoUrl} className={styles.accountImage} /> */}
            </div>
            <div className={styles.titleContainer}>
              {
                loading ? (
                  <div className={styles.skeletonText} />
                ) : (
                  <text className={styles.title}>{formatNumber(getTotal() - getTotalExpenses())} {user.currency || "ALL"}</text>
                )
              }
              <text
                className={styles.subtitle}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center"
                }}>
                Current Month: {loading ? (
                  <div className={styles.skeletonText} style={{ width: "20vw", height: 21 }} />
                ) : (
                  formatNumber(getMonthly() - getMonthlyExpenses())
                )} {" " + user.currency || " ALL"}
              </text>
            </div>
          </section>
          <section className={styles.bottomSection}>
            <Link to="/wallet" className={`${styles.buttonContainer} ${"link"}`}>
              <div className={styles.buttonContainer}>
                <IoWallet className={styles.buttonIcon} />
              </div>
            </Link>
            <Link to="/calendar" className={`${styles.buttonContainer} ${"link"}`}>
              <div className={styles.buttonContainer}>
                <IoCalendar className={styles.buttonIcon} />
              </div>
            </Link>
            <Link to="/analytics" className={`${styles.buttonContainer} ${"link"}`}>
              <div className={styles.buttonContainer}>
                <IoStatsChart className={styles.buttonIcon} />
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
            <Link to="/settings" className={`${styles.buttonContainer} ${"link"}`}>
              <div className={styles.buttonContainer}>
                <IoSettings className={styles.buttonIcon} />
              </div>
            </Link>
          </section>
        </main>
      </Layout>
    </>
  );
}