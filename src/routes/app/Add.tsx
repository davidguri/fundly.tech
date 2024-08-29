import React from "react";
import Layout from "../../components/layout/Layout";
import styles from "./styles/Add.module.scss";

import {
  IoCheckmarkCircle,
  IoChevronBack,
  IoHelpCircle,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";
import { Firestore } from "../../controllers/firestore.controller";
import { Transaction } from "../../models/transaction.model";

import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase";

export default function Add() {
  const auth = getAuth();
  const userLocal = JSON.parse(localStorage.getItem("userData"));

  const nav = useNavigate();

  const [workersData, setWorkersData] = React.useState([]);
  const [templates, setTemplates] = React.useState([]);

  const getWorkerData = async (workerId: string): Promise<any> => {
    const data = await Firestore.getUserById(workerId);
    return data;
  };

  const getWorkerIds = async () => {
    try {
      const q = query(
        collection(db, "businesses"),
        where("owner", "==", auth.currentUser.uid),
      );

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      // console.log(data[0].workers)
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
    }
  };

  async function fetchBusinessTemplates() {
    try {
      const docRef = doc(db, "businesses", userLocal.business);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const businessTemplates = data.templates || [];

        setTemplates(businessTemplates);
        // console.log(businessTemplates)
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching templates: ", error);
    }
  }

  React.useEffect(() => {
    getWorkerIds();
    fetchBusinessTemplates();
  }, []);

  const [name, setName] = React.useState("default");
  const [type, setType] = React.useState("");
  const [currency, setCurrency] = React.useState<string>();
  const [amount, setAmount] = React.useState("");
  const [duration, setDuration] = React.useState("");
  const [tip, setTip] = React.useState("");

  const [templateName, setTemplateName] = React.useState("default");

  const handleNameChange = (e: any) => {
    try {
      setName(e.target.value);
      // console.log(role)
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleCurrencyChange = (e: any) => {
    try {
      setCurrency(e.target.value);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const submitHandler = async () => {
    setShow(false);

    const id = uuidv4();

    const transactionData: Transaction = {
      id: id,
      name:
        name === "You"
          ? userLocal.displayName
          : name === "default"
            ? userLocal.displayName
            : name,
      type: type,
      amount: parseFloat(amount),
      currency: currency || userLocal.currency,
      tip: tip ? parseFloat(tip) : 0,
      business: option ? userLocal.business : userLocal.id,
      duration: duration ? parseFloat(duration) : null,
      incoming: option ? true : false,
      date: new Date(),
    };

    if (!id || !amount || !name || !type) {
      return;
    }

    try {
      if (option) {
        const docRef = await Firestore.addTransactionDocument(
          id,
          transactionData,
        );
        console.log("✅ Document written with ID: ", docRef);
      } else {
        const docRef = await Firestore.addExpenseDocument(id, transactionData);
        console.log("✅ Document written with ID: ", docRef);
      }
      setName("");
      setType("");
      setAmount("");
      setCurrency("");
      setTip("");
      setDuration("");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const [option, setOption] = React.useState(true);

  const selectOptionHandler = () => {
    setOption(!option);
  };

  const [show, setShow] = React.useState(false);
  const status: string = "success";

  const handleTemplateChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setTemplateName(e.target.value);
    const templateObj = templates.find(
      (template) => template.workName === e.target.value,
    );
    setType(templateObj.workName);
    setAmount(templateObj.amount);
    setCurrency(templateObj.currency);
    setDuration(templateObj.hours);
  };

  return (
    <>
      <Layout>
        <main className={styles.main}>
          <div className={styles.titleContainer}>
            <div onClick={() => nav(-1)}>
              <IoChevronBack className="title" color="#533fd5" />
            </div>
            <text className="title">New Entry</text>
          </div>
          <div className={styles.content}>
            <div className={styles.topContainer}>
              <div className={styles.chipContainer}>
                <div
                  className={`${styles.chip} ${option ? styles.selectedChip : ""}`}
                  onClick={selectOptionHandler}
                >
                  <text className={styles.chipText}>Work</text>
                </div>
                <div
                  className={`${styles.chip} ${!option ? styles.selectedChip : ""}`}
                  onClick={selectOptionHandler}
                >
                  <text className={styles.chipText}>Expenses</text>
                </div>
              </div>
              {option ? (
                <>
                  {userLocal.role === "Owner" && (
                    <div
                      className={styles.formInput}
                      style={{
                        paddingInline: 0,
                        width: "100%",
                        paddingBlock: 14,
                      }}
                    >
                      <select
                        name="Worker"
                        id="worker"
                        className={styles.select}
                        onChange={handleNameChange}
                        value={name}
                      >
                        <option value="default">Worker</option>
                        <option value="You">You</option>
                        {workersData.map((worker, i) => {
                          return (
                            <option key={i} value={worker.displayName}>
                              {worker.displayName}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}
                  <input
                    className={styles.formInput}
                    placeholder="Work Name"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    type="text"
                    autoCorrect="off"
                  />
                  <input
                    className={styles.formInput}
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                    inputMode="numeric"
                  />
                  <div
                    className={styles.formInput}
                    style={{
                      paddingInline: 0,
                      width: "100%",
                      paddingBlock: 14,
                    }}
                  >
                    <select
                      name="Currency"
                      id="currency"
                      className={styles.select}
                      onChange={handleCurrencyChange}
                      value={currency || userLocal.currency}
                    >
                      <option value="ALL">ALL</option>
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                      <option value="CAD">CAD</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                  <input
                    className={styles.formInput}
                    placeholder="Tip (optional)"
                    value={tip}
                    onChange={(e) => setTip(e.target.value)}
                    type="number"
                    inputMode="numeric"
                  />
                  <input
                    className={styles.formInput}
                    placeholder="Hours (optional)"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    type="number"
                    inputMode="numeric"
                  />
                </>
              ) : (
                <>
                  <input
                    className={styles.formInput}
                    placeholder="Expense Name"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    type="text"
                    autoCorrect="off"
                  />
                  <input
                    className={styles.formInput}
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                    inputMode="numeric"
                  />
                  <div
                    className={styles.formInput}
                    style={{
                      paddingInline: 0,
                      width: "100%",
                      paddingBlock: 14,
                    }}
                  >
                    <select
                      name="Currency"
                      id="currency"
                      className={styles.select}
                      onChange={handleCurrencyChange}
                      value={currency || userLocal.currency}
                    >
                      <option value="ALL">ALL</option>
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                      <option value="CAD">CAD</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </>
              )}
            </div>
            <div className={styles.bottomContainer}>
              {option && (
                <div className={styles.buttonContainer}>
                  <div className={styles.button}>
                    <select
                      name="Template"
                      id="template"
                      className={styles.templateSelect}
                      onChange={handleTemplateChange}
                      value={templateName}
                    >
                      <option value="default">Use Template</option>
                      {templates.map((template, i) => {
                        return (
                          <option value={template.workName} key={i}>
                            {template.workName}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  {userLocal.role !== "Worker" && (
                    <div
                      className={styles.button}
                      onClick={() => nav("/add_template")}
                    >
                      <text className={styles.buttonText}>New Template</text>
                    </div>
                  )}
                </div>
              )}
              <div
                className={styles.submitButton}
                onClick={() => (!amount || !name || !type ? {} : setShow(true))}
              >
                <text className={styles.submitButtonText}>Add Entry</text>
              </div>
            </div>
            <section
              className={styles.footer}
              style={{ display: `${show ? "flex" : "none" || "none"}` }}
            >
              <div className={styles.footerTopContainer}>
                <text className={styles.footerTitle}>
                  {status === "question" ? "Confirm Operation?" : "Success!"}
                </text>
                <text className={styles.footerSubtitle}>
                  {status === "question"
                    ? "Are you sure you want to continue?"
                    : "Operation completed successfully!"}
                </text>
              </div>
              <div className={styles.footerMiddleContainer}>
                {status === "question" ? (
                  <IoHelpCircle size={104} color="#533fd5" />
                ) : (
                  <IoCheckmarkCircle size={96} color="#533fd5" />
                )}
              </div>
              <div className={styles.footerBottomContainer}>
                <div className={styles.footerButton} onClick={submitHandler}>
                  <text className={styles.footerButtonText}>
                    {status === "question" ? "Confirm" : "Done"}
                  </text>
                </div>
                {status === "question" && (
                  <text
                    className={styles.footerCancelText}
                    onClick={() => setShow(false)}
                    style={{ color: "#533fd5" }}
                  >
                    Cancel
                  </text>
                )}
              </div>
            </section>
          </div>
        </main>
      </Layout>
    </>
  );
}
