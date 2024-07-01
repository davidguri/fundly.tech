import React from "react";
import styles from "./styles/Add.module.scss";
import Layout from "../../components/layout/Layout";

import { useNavigate } from "react-router-dom"
import { IoChevronBack } from "react-icons/io5"

import Transaction from "../../models/transaction.model";
import { Firestore } from "../../controllers/firestore.controller";
import { v4 as uuidv4 } from 'uuid';

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import { getAuth } from "firebase/auth";

export default function Add() {

  const auth = getAuth()

  const nav = useNavigate();

  const [workersData, setWorkersData] = React.useState([]);
  const [user, setUser]: any = React.useState([]);

  const getUserData = async () => {
    try {
      const data = await Firestore.getUserById(auth.currentUser.uid)
      setUser(data)
      // console.log(data)
      // console.log(user.displayName)
    } catch (error: any) {
      alert(error.message)
    }
  }

  const getWorkerData = async (workerId: string): Promise<any> => {
    const data = await Firestore.getUserById(workerId);
    return data
  }

  const getWorkerIds = async () => {
    try {
      const q = query(collection(db, "businesses"), where("owner", "==", auth.currentUser.uid));

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        ...doc.data()
      }))
      console.log(data[0].workers)
      const userDataPromises = data[0].workers.map(workerId => getWorkerData(workerId));
      const userDataResults = await Promise.all(userDataPromises);

      const validUserData = userDataResults.filter(userData => userData !== null);
      setWorkersData(validUserData);
    } catch (error: any) {
      console.log(error.message)
    }
  }

  React.useEffect(() => {
    getUserData()
    getWorkerIds()
  }, [])

  const [name, setName] = React.useState("default");
  const [type, setType] = React.useState("");
  const [currency, setCurrency] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [duration, setDuration] = React.useState("");
  const [tip, setTip] = React.useState("");

  const handleNameChange = (e: any) => {
    try {
      setName(e.target.value)
      // console.log(role)
    } catch (error: any) {
      alert(error.message)
    }
  }

  const submitHandler = async () => {

    const id = uuidv4()

    const transactionData: Transaction = {
      id: id,
      name: (name === "You" ? user.displayName : name === "default" ? user.displayName : name),
      type: type,
      amount: (parseFloat(amount)),
      currency: (currency || user.currency),
      tip: (tip ? parseFloat(tip) : 0),
      business: (option ? user.business : user.id),
      duration: (duration ? parseInt(duration) : null),
      incoming: (option ? true : false),
      date: new Date()
    }

    try {
      const docRef = await Firestore.addTransactionDocument(id, transactionData);
      console.log("✅ Document written with ID: ", docRef)
      alert("Entry Added Successfully!");
      setName("")
      setType("")
      setAmount("")
      setCurrency("")
      setTip("")
      setDuration("")
    } catch (error: any) {
      alert(error.message)
    }
  }

  const [option, setOption] = React.useState(true)

  const selectOptionHandler = () => {
    setOption(!option)
  }

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
                <div className={`${styles.chip} ${option ? styles.selectedChip : ""}`} onClick={selectOptionHandler}>
                  <text className={styles.chipText}>Work</text>
                </div>
                <div className={`${styles.chip} ${!option ? styles.selectedChip : ""}`} onClick={selectOptionHandler}>
                  <text className={styles.chipText}>Expenses</text>
                </div>
              </div>
              {
                option ? (
                  <>
                    <div className={styles.buttonContainer}>
                      <div className={styles.button} onClick={() => { }}>
                        <text className={styles.buttonText}>Use Template</text>
                      </div>
                      <div className={styles.button} style={{ backgroundColor: "#533fd5", borderColor: "#533fd5" }} onClick={() => { }}>
                        <text className={styles.buttonText} style={{ color: "#e5e4ec" }}>Create Template</text>
                      </div>
                    </div>
                    <div className={styles.formInput} style={{ paddingInline: 0, width: "100%" }}>
                      <select name="Role" id="role" className={styles.select} onChange={handleNameChange} value={name}>
                        <option value="default">Worker</option>
                        <option value="You">You</option>
                        {workersData.map((worker, i) => {
                          return (
                            <option key={i} value={worker.displayName}>{worker.displayName}</option>
                          )
                        })}
                      </select>
                    </div>
                    <input className={styles.formInput} placeholder="Work Name" value={type} onChange={(e) => setType(e.target.value)} type="text" autoCorrect="off" />
                    <input className={styles.formInput} placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} type="number" inputMode="numeric" />
                    <input className={styles.formInput} placeholder="Currency (optional)" value={currency} onChange={(e) => setCurrency(e.target.value)} type="text" autoCorrect="off" />
                    <input className={styles.formInput} placeholder="Tip (optional)" value={tip} onChange={(e) => setTip(e.target.value)} type="number" inputMode="numeric" />
                    <input className={styles.formInput} placeholder="Hours (optional)" value={duration} onChange={(e) => setDuration(e.target.value)} type="number" inputMode="numeric" />
                  </>
                ) : (
                  <>
                    <input className={styles.formInput} placeholder="Expense Name" value={type} onChange={(e) => setType(e.target.value)} type="text" autoCorrect="off" />
                    <input className={styles.formInput} placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} type="number" inputMode="numeric" />
                    <input className={styles.formInput} placeholder="Currency (optional)" value={currency} onChange={(e) => setCurrency(e.target.value)} type="text" autoCorrect="off" />
                  </>
                )
              }
            </div>
            <div className={styles.bottomContainer}>
              <div className={styles.submitButton} onClick={submitHandler}>
                <text className={styles.submitButtonText}>Submit</text>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
}