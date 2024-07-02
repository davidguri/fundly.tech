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

  const [transactions, setTransactions] = React.useState([]);
  const [workerTransactions, setWorkerTransactions] = React.useState([]);
  const [user, setUser]: any = React.useState([])

  const getUserData = async () => {
    const data = await Firestore.getUserById(auth.currentUser.uid)
    setUser(data)
    return data
  }

  React.useEffect(() => {
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

        const filteredTransactions = combinedTransactions.filter(transaction => {
          return transaction.name === userData.displayName
        })

        const workerTransactions = combinedTransactions.filter(transaction => {
          return transaction.name !== userData.displayName
        })

        setTransactions(filteredTransactions)
        setWorkerTransactions(workerTransactions)
      } catch (error: any) {
        alert("Error: " + error.message)
      }
    }
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

  const currentMonthWorkerTransactions = filterCurrentMonthTransactions(workerTransactions)

  const getMonthly = () => {
    let monthlyPay = 0
    let newMonthlyPay = 0;

    currentMonthTransactions.forEach((transaction) => {
      if (transaction.currency !== user.currency) {
        const newAmount = convertCurrency(transaction.currency, user.currency, transaction.amount);
        const newTip = convertCurrency(transaction.currency, user.currency, transaction.tip);
        transaction.incoming ? newMonthlyPay += newAmount + newTip : newMonthlyPay -= newAmount
      } else {
        transaction.incoming ? monthlyPay += transaction.amount + transaction.tip : monthlyPay = monthlyPay - transaction.amount
      }
    })
    return parseFloat((monthlyPay + newMonthlyPay).toFixed(2));
  }

  const getMonthlyWorkers = () => {
    let monthlyPay = 0
    let newMonthlyPay = 0;

    currentMonthWorkerTransactions.forEach((transaction) => {
      if (transaction.currency !== user.currency) {
        const newAmount = convertCurrency(transaction.currency, user.currency, transaction.amount);
        const newTip = convertCurrency(transaction.currency, user.currency, transaction.tip);
        transaction.incoming ? newMonthlyPay += newAmount + newTip : newMonthlyPay -= newAmount
      } else {
        transaction.incoming ? monthlyPay += transaction.amount + transaction.tip : monthlyPay = monthlyPay - transaction.amount
      }
    })
    return parseFloat((monthlyPay + newMonthlyPay).toFixed(2));
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

  const [option, setOption] = React.useState(true)

  const selectOptionHandler = () => {
    setOption(!option)
  }

  return (
    <>
      <Layout>
        <main className={styles.main} style={{ position: `${option ? "fixed" : "relative"}` }}>
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
              <text className={styles.balanceTitle}>{getMonthly()} {user.currency}</text>
            </div>
            <div className={styles.chipContainer}>
              <div className={`${styles.chip} ${option ? styles.selectedChip : ""}`} onClick={selectOptionHandler}>
                <text className={styles.chipText}>Business</text>
              </div>
              <div className={`${styles.chip} ${!option ? styles.selectedChip : ""}`} onClick={selectOptionHandler}>
                <text className={styles.chipText}>Individual</text>
              </div>
            </div>
            {
              option ? (
                <div className={styles.infoSection}>
                  <div className={styles.infoContainer}>
                    <text className={styles.infoTitle} style={{ color: "#533fd5" }}>{getMonthly() + getMonthlyWorkers()} {user.currency}</text>
                    <text className={styles.infoText}>Business</text>
                  </div>
                  <div className={styles.infoContainer}>
                    <text className={styles.infoTitle} style={{ color: "#533fd5" }}>{getMonthly()} {user.currency}</text>
                    <text className={styles.infoText}>You</text>
                  </div>
                  {
                    user.role === "Worker" ? (
                      <div style={{ display: "none" }} />
                    ) : (
                      <div className={styles.infoContainer}>
                        <text className={styles.infoTitle} style={{ color: "#533fd5" }}>{getMonthlyWorkers()} {user.currency}</text>
                        <text className={styles.infoText}>Wages</text>
                      </div>
                    )
                  }
                </div>
              ) : (
                <>
                  {
                    transactions.length > 0 ? (
                      <div className={styles.individualContainer}>
                        <text className={styles.nameText}>You</text>
                        {transactions.map((transaction) => (
                          <div className={styles.transaction}>
                            <text className={styles.transactionText}>{transaction.type}</text>
                            <text className={styles.transactionText} style={{ color: "#533fd5" }}>{transaction.incoming ? "+" : "-"} {transaction.amount} {transaction.currency}</text>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ display: "none" }} />
                    )
                  }
                  {Object.keys(groupedTransactions).map((name) => (
                    <div key={name} className={styles.individualContainer}>
                      <text className={styles.nameText}>{name}</text>
                      {groupedTransactions[name].map((transaction) => (
                        <div className={styles.transaction}>
                          <text className={styles.transactionText}>{transaction.type}</text>
                          <text className={styles.transactionText} style={{ color: "#533fd5" }}>+ {transaction.amount} {transaction.currency}</text>
                        </div>
                      ))}
                    </div>
                  ))}
                </>
              )
            }
          </div>
        </main>
      </Layout>
    </>
  )
}