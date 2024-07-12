import React from "react";
import styles from "./styles/Wallet.module.scss";
import Layout from "../../components/layout/Layout";

import { useNavigate } from "react-router-dom";

import { IoChevronBack } from "react-icons/io5";

import { Firestore } from "../../controllers/firestore.controller";
import { getAuth } from "firebase/auth";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";

export default function Wallet() {

  const auth = getAuth()

  const nav = useNavigate();

  const [loading, setLoading] = React.useState(true);

  const [expenses, setExpenses] = React.useState([])
  const [transactions, setTransactions] = React.useState([]);
  const [workerTransactions, setWorkerTransactions] = React.useState([]);
  const [user, setUser]: any = React.useState([])

  const getUserData = async () => {
    const data = await Firestore.getUserById(auth.currentUser.uid)
    setUser(data)
    return data
  }

  React.useEffect(() => {
    setLoading(true);

    const getExpenses = async () => {
      try {
        setExpenses([])
        const q = query(
          collection(db, "expenses"),
          where("business", "==", auth.currentUser.uid)
        );

        const querySnapshot = await getDocs(q);

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
        const q1 = query(collection(db, "transactions"), where("business", "==", userData.business));

        const q2 = query(collection(db, "transactions"), where("business", "==", userData.id));

        const [querySnapshot1, querySnapshot2] = await Promise.all([getDocs(q1), getDocs(q2)]);

        const transactions1 = querySnapshot1.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const transactions2 = querySnapshot2.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const combinedTransactions = [...transactions1, ...transactions2].reduce((acc, transaction) => {
          if (!acc.find(t => t.id === transaction.id)) {
            acc.push(transaction);
          }
          return acc;
        }, []);

        const filteredTransactions = combinedTransactions.filter(transaction => {
          return transaction.name === userData.displayName
        })

        const workerTransactions = combinedTransactions.filter(transaction => {
          return transaction.name !== userData.displayName
        })

        setTransactions(filteredTransactions)
        setWorkerTransactions(workerTransactions)
        setLoading(false)
      } catch (error: any) {
        alert("Error: " + error.message)
      }
    }
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
  } // TODO: MAKE THIS A SEPERATE COMPONENT

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
  } // TODO: USE WEB WORKER HERE

  const currentMonthTransactions = filterCurrentMonthTransactions(transactions);

  const currentMonthWorkerTransactions = filterCurrentMonthTransactions(workerTransactions)

  const currentMonthExpenses = filterCurrentMonthTransactions(expenses);

  const getMonthly = () => {
    let monthlyPay = 0
    let newMonthlyPay = 0;

    currentMonthTransactions.forEach((transaction) => {
      if (transaction.currency !== user.currency) {
        const newAmount = convertCurrency(transaction.currency, user.currency, parseFloat(transaction.amount));
        const newTip = convertCurrency(transaction.currency, user.currency, parseFloat(transaction.tip));
        transaction.incoming ? newMonthlyPay += newAmount + newTip : newMonthlyPay -= newAmount
      } else {
        transaction.incoming ? monthlyPay += parseFloat(transaction.amount) + parseFloat(transaction.tip) : monthlyPay = monthlyPay - parseFloat(transaction.amount)
      }
    })
    return parseFloat((monthlyPay + newMonthlyPay).toFixed(2));
  }

  const getMonthlyWorkers = () => {
    let monthlyPay = 0
    let newMonthlyPay = 0;

    currentMonthWorkerTransactions.forEach((transaction) => {
      if (transaction.currency !== user.currency) {
        const newAmount = convertCurrency(transaction.currency, user.currency, parseFloat(transaction.amount));
        const newTip = convertCurrency(transaction.currency, user.currency, parseFloat(transaction.tip));
        transaction.incoming ? newMonthlyPay += newAmount + newTip : newMonthlyPay -= newAmount
      } else {
        transaction.incoming ? monthlyPay += parseFloat(transaction.amount) + parseFloat(transaction.tip) : monthlyPay = monthlyPay - parseFloat(transaction.amount)
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

  const groupTransactionsByName = (transactions) => {
    return transactions.reduce((acc, transaction) => {
      const { name } = transaction;
      if (!acc[name]) {
        acc[name] = [];
      }
      acc[name].push(transaction);
      return acc;
    }, {});
  };

  const groupedTransactions = groupTransactionsByName(workerTransactions);

  const getTransactionsByName = (transactions, name: string) => {
    let amount = 0
    transactions.forEach((transaction) => {
      if (transaction.name === name) {
        amount += convertCurrency(transaction.currency, user.currency, parseFloat(transaction.amount)) + convertCurrency(transaction.currency, user.currency, parseFloat(transaction.tip))
      }
    })

    return amount;
  } // TODO: USE WEB WORKER HERE

  const [option, setOption] = React.useState("0")

  const selectOptionHandler = (option: string) => {
    setOption(option)
  }

  function formatNumber(number: number) {
    if (number % 1 === 0) {
      return number.toString();
    } else {
      return number.toFixed(2);
    }
  }

  return (
    <>
      <Layout>
        <main className={styles.main} style={{ position: `${option ? "fixed" : "inherit"}` }}>
          <div className={styles.titleContainer}>
            <div className={styles.titleLeftContainer}>
              <div onClick={() => nav(-1)}>
                <IoChevronBack className="title" color="#533fd5" />
              </div>
              <text className="title">Wallet</text>
            </div>
          </div>
          <div className={styles.walletContainer}>
            <div className={styles.balanceContainer}>
              <text className={styles.balanceSubtitle}>Your Balance</text>
              <text className={styles.balanceTitle} style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>{loading ? (<div className={styles.skeletonText} style={{ height: 36 }} />) : formatNumber(getTotal() - getTotalExpenses())} {user.currency}</text>
            </div>
            {
              user.role === "Worker" || user.role === "Freelancer" ? (
                <>
                  {
                    transactions && (
                      <div className={styles.transaction}>
                        <text className={styles.transactionText}>Work</text>
                        <text className={styles.transactionText} style={{ color: "#533fd5" }}>{getMonthly()} {user.currency}</text>
                      </div>
                    )
                  }
                  <div className={styles.transaction}>
                    <text className={styles.transactionText}>Expenses</text>
                    <text className={styles.transactionText} style={{ color: "#533fd5" }}>{getMonthlyExpenses()} {user.currency}</text>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.chipContainer}>
                    <div className={`${styles.chip} ${option === "0" ? styles.selectedChip : ""}`} onClick={() => selectOptionHandler("0")}>
                      <text className={styles.chipText}>Business</text>
                    </div>
                    <div className={`${styles.chip} ${option === "1" ? styles.selectedChip : ""}`} onClick={() => selectOptionHandler("1")}>
                      <text className={styles.chipText}>Individual</text>
                    </div>
                  </div>
                  {
                    option === "0" ? (
                      <div className={styles.infoSection}>
                        <div className={styles.infoContainer}>
                          <text className={styles.infoTitle} style={{ color: "#533fd5", display: "flex", flexDirection: "row", alignItems: "center" }}>{loading ? (<div className={styles.skeletonText} style={{ height: 24, width: "20vw" }} />) : getMonthly() + getMonthlyWorkers()} {user.currency}</text>
                          <text className={styles.infoText}>Business</text>
                        </div>
                        <div className={styles.infoContainer}>
                          <text className={styles.infoTitle} style={{ color: "#533fd5", display: "flex", flexDirection: "row", alignItems: "center" }}>{loading ? (<div className={styles.skeletonText} style={{ height: 24, width: "20vw" }} />) : getMonthly()} {user.currency}</text>
                          <text className={styles.infoText}>You</text>
                        </div>
                        <div className={styles.infoContainer}>
                          <text className={styles.infoTitle} style={{ color: "#533fd5", display: "flex", flexDirection: "row", alignItems: "center" }}>{loading ? (<div className={styles.skeletonText} style={{ height: 24, width: "20vw" }} />) : getMonthlyWorkers()} {user.currency}</text>
                          <text className={styles.infoText}>Wages</text>
                        </div>
                        <div className={styles.infoContainer}>
                          <text className={styles.infoTitle} style={{ color: "#533fd5", display: "flex", flexDirection: "row", alignItems: "center" }}>{loading ? (<div className={styles.skeletonText} style={{ height: 24, width: "20vw" }} />) : getMonthlyExpenses()} {user.currency}</text>
                          <text className={styles.infoText}>Expenses</text>
                        </div>
                      </div>
                    ) : (
                      <>
                        {
                          transactions && (
                            <div className={styles.transaction}>
                              <text className={styles.transactionText}>You</text>
                              <text className={styles.transactionText} style={{ color: "#533fd5" }}>{getMonthly()} {user.currency}</text>
                            </div>
                          )
                        }
                        {Object.keys(groupedTransactions).map((name) => (
                          <div className={styles.transaction} key={name}>
                            <text className={styles.transactionText}>{name}</text>
                            <text className={styles.transactionText} style={{ color: "#533fd5" }}>{getTransactionsByName(currentMonthWorkerTransactions, name)} {user.currency}</text>
                          </div>
                        ))}
                      </>
                    )
                  }
                </>
              )
            }
          </div>
        </main>
      </Layout>
    </>
  )
}