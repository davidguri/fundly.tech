import React from "react";
import styles from "./styles/Transactions.module.scss";
import Layout from "../../components/layout/Layout";

import { useNavigate } from "react-router-dom";

import Transaction from "../../components/global/Transaction.component";

import { IoChevronBack, IoRefresh, IoHelpCircle, IoCheckmarkCircle } from "react-icons/io5";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import { Firestore } from "../../controllers/firestore.controller";
import { auth } from "../../../firebase";

import Loader from "../../components/global/Loader.component";

export default function Transactions() {

  const nav = useNavigate();

  const [loading, setLoading] = React.useState(true);

  const [expenses, setExpenses] = React.useState([]);
  const [transactions, setTransactions] = React.useState([]);
  const [myTransactions, setMyTransactions] = React.useState([]);
  const [user, setUser]: any = React.useState([])

  const getUserData = async () => {
    const data = await Firestore.getUserById(auth.currentUser.uid)
    setUser(data);
    return data
  }

  const getMyTransactions = async () => {
    setLoading(true);
    try {
      const userData = await getUserData()
      setMyTransactions([])
      const q1 = query(collection(db, "transactions"), where("name", "==", userData.displayName));

      const querySnapshot1 = await getDocs(q1);

      // Combine the results
      const transactions1 = querySnapshot1.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Combine the two arrays and remove duplicates
      const combinedTransactions = [...transactions1, ...transactions1].reduce((acc, transaction) => {
        if (!acc.find(t => t.id === transaction.id)) {
          acc.push(transaction);
        }
        return acc;
      }, []);

      const sortedTransactions = combinedTransactions.sort((a, b) => b.date - a.date)

      setMyTransactions(sortedTransactions)
    } catch (error: any) {
      alert("Error: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const getExpenses = async () => {
    setLoading(true)
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

      const combinedTransactions = [...userTransactions, ...userTransactions].reduce((acc, transaction) => {
        if (!acc.find(t => t.id === transaction.id)) {
          acc.push(transaction);
        }
        return acc;
      }, []);

      const sortedTransactions = combinedTransactions.sort((a, b) => b.date - a.date)

      setExpenses(sortedTransactions)
    } catch (error: any) {
      alert("Error: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const getTransactions = async () => {
    setLoading(true)
    try {
      const userData = await getUserData()
      setTransactions([])
      if (userData.role === "Worker") {
        const q = query(collection(db, "transactions"), where("name", "==", userData.displayName));

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          ...doc.data()
        }))

        const filteredTransactions = data.filter(transaction => {
          return transaction.name === userData.displayName
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

        const filteredTransactios = combinedTransactions.filter((transaction) => {
          return transaction.name !== userData.displayName
        })

        const sortedTransactions = filteredTransactios.sort((a, b) => b.date - a.date)

        setTransactions(sortedTransactions)
      }
      // console.log(transactions)
    } catch (error: any) {
      alert("Error: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    getMyTransactions()
  }, [])

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

  const handleDelete = async (id: string, type: string) => {
    setShow(false)
    if (type === "expenses") {
      await Firestore.deleteExpense(id)
    } else {
      await Firestore.deleteTransaction(id)
    }
    getExpenses()
    getTransactions()
    getMyTransactions()
  } // ! WATCH OUT THIS CODE DELETES STUFF FROM THE BOTTOM TO THE TOP

  const handleReload = () => {
    getExpenses()
    getTransactions()
    getMyTransactions()
  }

  const [option, setOption] = React.useState("0")

  const selectOptionHandler = (option: string) => {
    setOption(option)
    if (option === "1") {
      getTransactions()
    } else if (option === "2") {
      getExpenses()
    }
  }

  const [show, setShow] = React.useState(false);
  const status = "question"

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
            <div onClick={handleReload}>
              <IoRefresh className="title" color="#533fd5" size={32} />
            </div>
          </div>
          <div className={styles.transactionsContainer}>
            <div className={styles.chipContainer}>
              <div className={`${styles.chip} ${option === "0" ? styles.selectedChip : ""}`} onClick={() => selectOptionHandler("0")}>
                <text className={styles.chipText}>You</text>
              </div>
              {
                user.role === "Worker" ? (
                  <div style={{ display: "none" }} />
                ) : (
                  <div className={`${styles.chip} ${option === "1" ? styles.selectedChip : ""}`} onClick={() => selectOptionHandler("1")}>
                    <text className={styles.chipText}>Workers</text>
                  </div>
                )
              }
              <div className={`${styles.chip} ${option === "2" ? styles.selectedChip : ""}`} onClick={() => selectOptionHandler("2")}>
                <text className={styles.chipText}>Expenses</text>
              </div>
            </div>
            {
              option === "0" ? (
                <>
                  {
                    loading ? (
                      <Loader />
                    ) : (
                      myTransactions.map((transaction, i) => {
                        const date = new Date(transaction.date.seconds * 1000)
                        const formattedDate = formatTimestamp(date);
                        return (
                          // TODO: make this a seperate component
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
                                <div className={styles.footerButton} onClick={() => handleDelete(transaction.id, "transactions")}>
                                  <text className={styles.footerButtonText}>{status === "question" ? "Confirm" : "Done"}</text>
                                </div>
                                <text className={styles.footerCancelText} onClick={() => setShow(false)} style={{ color: "#533fd5" }}>Cancel</text>
                              </div>
                            </section>
                            <Transaction key={i} incoming={transaction.incoming} date={formattedDate} type={transaction.type} name={transaction.name} amount={transaction.amount} tip={transaction.tip} duration={transaction.duration} onDelete={() => setShow(true)} currency={transaction.currency} />
                          </>
                        )
                      })
                    )
                  }
                </>
              ) : (
                <>
                  {
                    option === "1" ? (
                      <>
                        {loading ? (
                          <Loader />
                        ) : (
                          transactions.map((transaction, i) => {
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
                                    <div className={styles.footerButton} onClick={() => handleDelete(transaction.id, "transactions")}>
                                      <text className={styles.footerButtonText}>{status === "question" ? "Confirm" : "Done"}</text>
                                    </div>
                                    <text className={styles.footerCancelText} onClick={() => setShow(false)} style={{ color: "#533fd5" }}>Cancel</text>
                                  </div>
                                </section>
                                <Transaction key={i} incoming={transaction.incoming} date={formattedDate} type={transaction.type} name={transaction.name} amount={transaction.amount} tip={transaction.tip} duration={transaction.duration} onDelete={() => setShow(true)} currency={transaction.currency} />
                              </>
                            )
                          }))}
                      </>
                    ) : (
                      <>
                        {loading ? (
                          <Loader />
                        ) : (
                          expenses.map((expense, i) => {
                            const date = new Date(expense.date.seconds * 1000)
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
                                    <div className={styles.footerButton} onClick={() => handleDelete(expense.id, "expenses")}>
                                      <text className={styles.footerButtonText}>{status === "question" ? "Confirm" : "Done"}</text>
                                    </div>
                                    <text className={styles.footerCancelText} onClick={() => setShow(false)} style={{ color: "#533fd5" }}>Cancel</text>
                                  </div>
                                </section>
                                <Transaction key={i} incoming={expense.incoming} date={formattedDate} type={expense.type} amount={expense.amount} onDelete={() => setShow(true)} currency={expense.currency} />
                              </>
                            )
                          }))}
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