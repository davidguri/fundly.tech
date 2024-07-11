import React from "react";
import styles from "./styles/AddMember.module.scss";

import { useNavigate } from "react-router-dom"
import { IoChevronBack, IoHelpCircle, IoCheckmarkCircle } from "react-icons/io5"

import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { getAuth } from "firebase/auth";
import { Firestore } from "../../controllers/firestore.controller";

import { sendEmail } from "../../api/email.api";

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
    setShow(false);
    try {
      const pendingWorkersRef = collection(db, "businesses", businessId, "pendingWorkers");

      const authCode = (Math.floor(100000000 + Math.random() * 900000000)).toString();

      await addDoc(pendingWorkersRef, { ...worker, authCode })

      sendEmail(worker, businessId, authCode)

      setName("")
      setEmail("")
    } catch (error) {
      console.error("Error adding pending worker:", error);
    }
  };

  const worker = {
    name: name,
    email: email,
  }

  React.useEffect(() => {
    getUserData()
  }, [])

  const [show, setShow] = React.useState(false);
  const status = "question"

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
            <input className={styles.formInput} placeholder="Worker Email" value={email} onChange={(e) => setEmail(e.target.value)} type="text" autoCorrect="off" autoCapitalize="off" />
            <text className={styles.explainText}>For security and privacy, the business owner must create the initial worker account. The worker will complete their profile during sign-up. This serves as their invitation to join the business.</text>
          </div>
          <div className={styles.bottomContainer}>
            <div className={styles.submitButton} onClick={() => name && email ? setShow(true) : {}}>
              <text className={styles.submitButtonText}>Add Worker</text>
            </div>
          </div>
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
              <div className={styles.footerButton} onClick={() => addPendingWorker(user.business, worker)}>
                <text className={styles.footerButtonText}>{status === "question" ? "Confirm" : "Done"}</text>
              </div>
              <text className={styles.footerCancelText} onClick={() => setShow(false)} style={{ color: "#533fd5" }}>Cancel</text>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}