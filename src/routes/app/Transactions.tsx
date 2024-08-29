import React from "react";
import Layout from "../../components/layout/Layout";
import styles from "./styles/Transactions.module.scss";

import { useNavigate } from "react-router-dom";

import Transaction from "../../components/global/Transaction.component";

import { Firestore } from "../../controllers/firestore.controller";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { IoChevronBack, IoHelpCircle, IoRefresh } from "react-icons/io5";
import { auth, db } from "../../../firebase";

import Loader from "../../components/global/Loader.component";

export default function Transactions() {
  const nav = useNavigate();

  const [loading, setLoading] = React.useState(true);

  const [expenses, setExpenses] = React.useState([]);
  const [transactions, setTransactions] = React.useState([]);
  const [myTransactions, setMyTransactions] = React.useState([]);

  const [workersData, setWorkersData] = React.useState([]);

  const getWorkerData = async (workerId: string): Promise<any> => {
    const data = await Firestore.getUserById(workerId);
    return data;
  };

  const getWorkerIds = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "businesses"),
        where("owner", "==", auth.currentUser.uid),
      );

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      console.log(data[0].workers);
      const userDataPromises = data[0].workers.map((workerId: string) =>
        getWorkerData(workerId),
      );
      const userDataResults = await Promise.all(userDataPromises);

      const validUserData = userDataResults.filter(
        (userData) => userData !== null,
      );
      setWorkersData(validUserData);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getMyTransactions = async () => {
    setLoading(true);
    try {
      setMyTransactions([]);
      const q1 = query(
        collection(db, "transactions"),
        where("name", "==", userLocal.displayName),
      );

      const querySnapshot1 = await getDocs(q1);

      // Combine the results
      const transactions1 = querySnapshot1.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Combine the two arrays and remove duplicates
      const combinedTransactions = [...transactions1, ...transactions1].reduce(
        (acc, transaction) => {
          if (!acc.find((t) => t.id === transaction.id)) {
            acc.push(transaction);
          }
          return acc;
        },
        [],
      );

      const sortedTransactions = combinedTransactions.sort(
        (a, b) => b.date - a.date,
      );

      setMyTransactions(sortedTransactions);
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getExpenses = async () => {
    setLoading(true);
    try {
      setExpenses([]);
      const q = query(
        collection(db, "expenses"),
        where("business", "==", auth.currentUser.uid),
      );

      // Execute the query
      const querySnapshot = await getDocs(q);

      // Map the results to an array of transaction objects
      const userTransactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const combinedTransactions = [
        ...userTransactions,
        ...userTransactions,
      ].reduce((acc, transaction) => {
        if (!acc.find((t) => t.id === transaction.id)) {
          acc.push(transaction);
        }
        return acc;
      }, []);

      const sortedTransactions = combinedTransactions.sort(
        (a, b) => b.date - a.date,
      );

      setExpenses(sortedTransactions);
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getTransactions = async () => {
    setLoading(true);
    try {
      setTransactions([]);
      if (userLocal.role === "Worker") {
        const q = query(
          collection(db, "transactions"),
          where("name", "==", userLocal.displayName),
        );

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
        }));

        const filteredTransactions = data.filter((transaction) => {
          return transaction.name === userLocal.displayName;
        });

        const sortedTransactions = filteredTransactions.sort(
          (a, b) => b.date - a.date,
        );

        setTransactions(sortedTransactions);
      } else {
        const q1 = query(
          collection(db, "transactions"),
          where("business", "==", userLocal.business),
        );

        const q2 = query(
          collection(db, "transactions"),
          where("business", "==", userLocal.id),
        );

        const [querySnapshot1, querySnapshot2] = await Promise.all([
          getDocs(q1),
          getDocs(q2),
        ]);

        // Combine the results
        const transactions1 = querySnapshot1.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const transactions2 = querySnapshot2.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Combine the two arrays and remove duplicates
        const combinedTransactions = [
          ...transactions1,
          ...transactions2,
        ].reduce((acc, transaction) => {
          if (!acc.find((t) => t.id === transaction.id)) {
            acc.push(transaction);
          }
          return acc;
        }, []);

        const filteredTransactios = combinedTransactions.filter(
          (transaction) => {
            return transaction.name !== userLocal.displayName;
          },
        );

        const sortedTransactions = filteredTransactios.sort(
          (a, b) => b.date - a.date,
        );

        setTransactions(sortedTransactions);
      }
      // console.log(transactions)
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getWorkerIds();
    getMyTransactions();
  }, []);

  const handleDelete = async (id: string, type: string) => {
    if (type == "expenses") {
      // await deleteDoc(doc(db, "expenses", id));
    } else {
      await deleteDoc(doc(db, "transactions", id));
    }
    console.log(`Id: ${id} Type: ${type}`);
    setShow(false);
    getExpenses();
    getTransactions();
    getMyTransactions();
  }; // WARNING: This function is not working

  const handleReload = () => {
    getExpenses();
    getTransactions();
    getMyTransactions();
  };

  const [option, setOption] = React.useState("0");
  const [workerOption, setWorkerOption] = React.useState("0");

  const selectOptionHandler = (option: string) => {
    setOption(option);
    setWorkerOption("0");
    if (option === "1") {
      getTransactions();
    } else if (option === "2") {
      getExpenses();
    }
  };

  const selectWorkerHandler = (workerName: string) => {
    workerOption === workerName
      ? setWorkerOption("0")
      : setWorkerOption(workerName);
    console.log(workerName);
    getTransactionsByName(workerName);
  };

  const [workerTransactions, setWorkerTransactions] = React.useState([]);

  const getTransactionsByName = (name: string) => {
    const transactionsById = transactions.filter((transaction) => {
      return transaction.name === name;
    });

    setWorkerTransactions(transactionsById);
    console.log(workerTransactions);
  };

  const [show, setShow] = React.useState(false);

  const userLocal = JSON.parse(localStorage.getItem("userData"));

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
          <div className={styles.chipContainer}>
            <div
              className={`${styles.chip} ${option === "0" && styles.selectedChip}`}
              onClick={() => selectOptionHandler("0")}
            >
              <text className={styles.chipText}>You</text>
            </div>
            {userLocal.role === "Owner" && (
              <div
                className={`${styles.chip} ${option === "1" && styles.selectedChip}`}
                onClick={() => selectOptionHandler("1")}
              >
                <text className={styles.chipText}>Workers</text>
              </div>
            )}
            <div
              className={`${styles.chip} ${option === "2" && styles.selectedChip}`}
              onClick={() => selectOptionHandler("2")}
            >
              <text className={styles.chipText}>Expenses</text>
            </div>
          </div>
          {option === "1" && (
            <div className={styles.chipContainer}>
              {workersData.map((worker, i) => {
                return (
                  <div
                    key={i}
                    className={`${styles.miniChip} ${workerOption === worker.displayName && styles.selectedChip}`}
                    onClick={() => selectWorkerHandler(worker.displayName)}
                  >
                    <text className={styles.miniChipText}>
                      {worker.displayName}
                    </text>
                  </div>
                );
              })}
            </div>
          )}
          <div className={styles.transactionsContainer}>
            {option === "0" ? (
              <>
                {loading ? (
                  <Loader />
                ) : (
                  myTransactions.map((transaction, i) => {
                    return (
                      // TODO: make this a seperate component
                      <>
                        <section
                          className={styles.footer}
                          style={{
                            display: `${show ? "flex" : "none"}`,
                          }}
                          key={i}
                        >
                          <div className={styles.footerTopContainer}>
                            <text className={styles.footerTitle}>
                              Confirm Operation
                            </text>
                            <text className={styles.footerSubtitle}>
                              Are you sure you want to continue?
                            </text>
                          </div>
                          <div className={styles.footerMiddleContainer}>
                            <IoHelpCircle size={104} color="#533fd5" />
                          </div>
                          <div className={styles.footerBottomContainer}>
                            <div
                              className={styles.footerButton}
                              onClick={() =>
                                handleDelete(transaction.id, "transactions")
                              }
                            >
                              <text className={styles.footerButtonText}>
                                Confirm
                              </text>
                            </div>
                            <text
                              className={styles.footerCancelText}
                              onClick={() => setShow(false)}
                              style={{ color: "#533fd5" }}
                            >
                              Cancel
                            </text>
                          </div>
                        </section>
                        <Transaction
                          incoming={transaction.incoming}
                          date={transaction.date.seconds * 1000}
                          type={transaction.type}
                          name={transaction.name}
                          amount={transaction.amount}
                          tip={transaction.tip}
                          duration={transaction.duration}
                          onDelete={() => setShow(true)}
                          currency={transaction.currency}
                        />
                      </>
                    );
                  })
                )}
              </>
            ) : (
              <>
                {option === "1" ? (
                  <>
                    {loading ? (
                      <Loader />
                    ) : (
                      <>
                        {workerOption !== "0"
                          ? workerTransactions.map((transaction, i) => {
                              return (
                                <>
                                  <section
                                    className={styles.footer}
                                    style={{
                                      display: `${show ? "flex" : "none"}`,
                                    }}
                                    key={i}
                                  >
                                    <div className={styles.footerTopContainer}>
                                      <text className={styles.footerTitle}>
                                        Confirm Operation?
                                      </text>
                                      <text className={styles.footerSubtitle}>
                                        Are you sure you want to continue?
                                      </text>
                                    </div>
                                    <div
                                      className={styles.footerMiddleContainer}
                                    >
                                      <IoHelpCircle
                                        size={104}
                                        color="#533fd5"
                                      />
                                    </div>
                                    <div
                                      className={styles.footerBottomContainer}
                                    >
                                      <div
                                        className={styles.footerButton}
                                        onClick={() =>
                                          handleDelete(
                                            transaction.id,
                                            "transactions",
                                          )
                                        }
                                      >
                                        <text
                                          className={styles.footerButtonText}
                                        >
                                          Confirm
                                        </text>
                                      </div>
                                      <text
                                        className={styles.footerCancelText}
                                        onClick={() => setShow(false)}
                                        style={{ color: "#533fd5" }}
                                      >
                                        Cancel
                                      </text>
                                    </div>
                                  </section>
                                  <Transaction
                                    incoming={transaction.incoming}
                                    date={transaction.date.seconds * 1000}
                                    type={transaction.type}
                                    name={transaction.name}
                                    amount={transaction.amount}
                                    tip={transaction.tip}
                                    duration={transaction.duration}
                                    onDelete={() => setShow(true)}
                                    currency={transaction.currency}
                                  />
                                </>
                              );
                            })
                          : transactions.map((transaction, i) => {
                              return (
                                <>
                                  <section
                                    className={styles.footer}
                                    style={{
                                      display: `${show ? "flex" : "none"}`,
                                    }}
                                    key={i}
                                  >
                                    <div className={styles.footerTopContainer}>
                                      <text className={styles.footerTitle}>
                                        Confirm Operation?
                                      </text>
                                      <text className={styles.footerSubtitle}>
                                        Are you sure you want to continue?
                                      </text>
                                    </div>
                                    <div
                                      className={styles.footerMiddleContainer}
                                    >
                                      <IoHelpCircle
                                        size={104}
                                        color="#533fd5"
                                      />
                                    </div>
                                    <div
                                      className={styles.footerBottomContainer}
                                    >
                                      <div
                                        className={styles.footerButton}
                                        onClick={() =>
                                          handleDelete(
                                            transaction.id,
                                            "transactions",
                                          )
                                        }
                                      >
                                        <text
                                          className={styles.footerButtonText}
                                        >
                                          Confirm
                                        </text>
                                      </div>
                                      <text
                                        className={styles.footerCancelText}
                                        onClick={() => setShow(false)}
                                        style={{ color: "#533fd5" }}
                                      >
                                        Cancel
                                      </text>
                                    </div>
                                  </section>
                                  <Transaction
                                    incoming={transaction.incoming}
                                    date={transaction.date.seconds * 1000}
                                    type={transaction.type}
                                    name={transaction.name}
                                    amount={transaction.amount}
                                    tip={transaction.tip}
                                    duration={transaction.duration}
                                    onDelete={() => setShow(true)}
                                    currency={transaction.currency}
                                  />
                                </>
                              );
                            })}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {loading ? (
                      <Loader />
                    ) : (
                      expenses.map((expense, i) => {
                        return (
                          <>
                            <section
                              className={styles.footer}
                              style={{
                                display: `${show ? "flex" : "none"}`,
                              }}
                              key={i}
                            >
                              <div className={styles.footerTopContainer}>
                                <text className={styles.footerTitle}>
                                  Confirm Operation?
                                </text>
                                <text className={styles.footerSubtitle}>
                                  Are you sure you want to continue?
                                </text>
                              </div>
                              <div className={styles.footerMiddleContainer}>
                                <IoHelpCircle size={104} color="#533fd5" />
                              </div>
                              <div className={styles.footerBottomContainer}>
                                <div
                                  className={styles.footerButton}
                                  onClick={() =>
                                    handleDelete(expense.id, "expenses")
                                  }
                                >
                                  <text className={styles.footerButtonText}>
                                    Confirm
                                  </text>
                                </div>
                                <text
                                  className={styles.footerCancelText}
                                  onClick={() => setShow(false)}
                                  style={{ color: "#533fd5" }}
                                >
                                  Cancel
                                </text>
                              </div>
                            </section>
                            <Transaction
                              incoming={expense.incoming}
                              date={expense.date.seconds * 1000}
                              type={expense.type}
                              amount={expense.amount}
                              onDelete={() => setShow(true)}
                              currency={expense.currency}
                            />
                          </>
                        );
                      })
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </main>
      </Layout>
    </>
  );
}
