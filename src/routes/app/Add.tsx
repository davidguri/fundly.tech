import React from "react";
import styles from "./styles/Add.module.scss";
import Layout from "../../components/layout/Layout";

import { useNavigate } from "react-router-dom"
import { IoChevronBack } from "react-icons/io5"

import Transaction from "../../models/transaction.model";
import { Firestore } from "../../controllers/firestore.controller";
import { v4 as uuidv4 } from 'uuid';

import { auth } from "../../../firebase"

export default function Add() {

  const nav = useNavigate();

  const [name, setName] = React.useState("");
  const [type, setType] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [duration, setDuration] = React.useState("");
  const [tip, setTip] = React.useState("");

  const submitHandler = async () => {
    const transactionData: Transaction = {
      name: name,
      type: type,
      amount: parseFloat(amount),
      tip: parseFloat(tip),
      userId: auth.currentUser.uid,
      duration: parseInt(duration),
      incoming: true,
      date: new Date()
    }

    try {
      const docRef = await Firestore.addTransactionDocument(uuidv4(), transactionData);
      console.log("✅ Document written with ID: ", docRef)
      alert("Entry Added Successfully!");
    } catch (error: any) {
      alert(error.message)
    }
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
              <div className={styles.inlineContainer}>
                <div className={styles.button}>
                  <text className={styles.buttonText}>Create Template</text>
                </div>
                <div className={styles.button} style={{ backgroundColor: "#533fd5" }}>
                  <text className={styles.buttonText} style={{ color: "#e5e4ec" }}>Use Template</text>
                </div>
              </div>
              <input className={styles.formInput} placeholder="Worker Name" value={name} onChange={(e) => setName(e.target.value)} type="text" autoCorrect="off" />
              <input className={styles.formInput} placeholder="Entry Type" value={type} onChange={(e) => setType(e.target.value)} type="text" autoCorrect="off" />
              <input className={styles.formInput} placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} type="number" inputMode="numeric" />
              <input className={styles.formInput} placeholder="Tip" value={tip} onChange={(e) => setTip(e.target.value)} type="number" inputMode="numeric" />
              <input className={styles.formInput} placeholder="Duration (hours)" value={duration} onChange={(e) => setDuration(e.target.value)} type="number" inputMode="numeric" />
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