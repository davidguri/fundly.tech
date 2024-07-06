import React from "react";
import styles from "./styles/AddMember.module.scss";

import { useNavigate } from "react-router-dom"
import { IoChevronBack } from "react-icons/io5"

import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { getAuth } from "firebase/auth";
import { Firestore } from "../../controllers/firestore.controller";

export default function AddMember() {

  const auth = getAuth();
  const [user, setUser]: any = React.useState([])

  const getUserData = async (): Promise<any> => {
    const data = await Firestore.getUserById(auth.currentUser.uid);
    setUser(data);
  }

  const nav = useNavigate()

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");

  const addPendingWorker = async (businessId: string, worker) => {
    try {
      const pendingWorkersRef = collection(db, "businesses", businessId, "pendingWorkers");

      await addDoc(pendingWorkersRef, worker);

      alert("Pending worker added successfully");
      setName("")
      setEmail("")
    } catch (error) {
      console.error("Error adding pending worker:", error);
    }
  };

  const worker = {
    name: name,
    email: email
  }

  React.useEffect(() => {
    getUserData()
  }, [])

  return (
    <>
      <main className={styles.main}>
        <div className={styles.titleContainer}>
          <div onClick={() => nav(-1)}>
            <IoChevronBack className="title" color="#533fd5" />
          </div>
          <text className="title">Add Worker</text>
        </div>
        <div className={styles.content}>
          <div className={styles.topContainer}>
            <input className={styles.formInput} placeholder="Worker Name" value={name} onChange={(e) => setName(e.target.value)} type="text" autoCorrect="off" />
            <input className={styles.formInput} placeholder="Worker Email" value={email} onChange={(e) => setEmail(e.target.value)} type="text" autoCorrect="off" />
            <text className={styles.explainText}>For security and privacy, the business owner must create the initial worker account. The worker will complete their profile during sign-up, serving as their invitation to join the business.</text>
          </div>
          <div className={styles.bottomContainer}>
            <div className={styles.submitButton} onClick={() => addPendingWorker(user.business, worker)}>
              <text className={styles.submitButtonText}>Add Worker</text>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}