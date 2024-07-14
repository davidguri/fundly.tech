import React from "react";
import styles from "./styles/AddTemplate.module.scss";

import { useNavigate } from "react-router-dom"
import { IoChevronBack, IoHelpCircle, IoCheckmarkCircle } from "react-icons/io5"

// import { updateDoc, arrayUnion, doc } from "firebase/firestore";
// import { db } from "../../../firebase";
import { getAuth } from "firebase/auth";
import { Firestore } from "../../controllers/firestore.controller";

export default function AddTemplate() {

  const auth = getAuth();
  const [user, setUser]: any = React.useState([])

  const getUserData = async (): Promise<any> => {
    const data = await Firestore.getUserById(auth.currentUser.uid);
    setUser(data);
  }

  const nav = useNavigate()

  const [name, setName] = React.useState("");
  const [currency, setCurrency] = React.useState<string>();
  const [amount, setAmount] = React.useState("");
  const [duration, setDuration] = React.useState("");

  const addTemplate = async () => {
    setShow(false);
    try {
      // const userRef = doc(db, "users", auth.currentUser.uid);

      // const newTemplate = {
      //   name: name,
      //   amount: amount,
      //   currency: currency,
      //   hours: duration,
      // };

      // await updateDoc(userRef, {
      //   templates: {
      //     ...userRef['templates'],
      //     name: newTemplate
      //   }
      // });
    } catch (error) {
      console.error("Error adding template:", error);
    }
  };

  React.useEffect(() => {
    getUserData()
  }, [])

  const [show, setShow] = React.useState(false);
  const status = "question";

  const handleCurrencyChange = (e: any) => {
    try {
      setCurrency(e.target.value)
    } catch (error: any) {
      alert(error.message)
    }
  }

  return (
    <>
      <main className={styles.main}>
        <div className={styles.titleContainer}>
          <div onClick={() => nav(-1)}>
            <IoChevronBack className="title" color="#533fd5" />
          </div>
          <text className="title">New Template</text>
        </div>
        <div className={styles.content}>
          <div className={styles.topContainer}>
            <input className={styles.formInput} placeholder="Work Name" value={name} onChange={(e) => setName(e.target.value)} type="text" autoCorrect="off" />
            <input className={styles.formInput} placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} type="number" inputMode="numeric" />
            <div className={styles.formInput} style={{ paddingInline: 0, width: "100%", paddingBlock: 14 }}>
              <select name="Currency" id="currency" className={styles.select} onChange={handleCurrencyChange} value={currency || user.currency}>
                <option value="ALL">ALL</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="CAD">CAD</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <input className={styles.formInput} placeholder="Hours" value={duration} onChange={(e) => setDuration(e.target.value)} type="number" inputMode="numeric" />
          </div>
          <div className={styles.bottomContainer}>
            <div className={styles.submitButton} onClick={() => name && amount && currency && duration ? setShow(true) : {}}>
              <text className={styles.submitButtonText}>Add Template</text>
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
              <div className={styles.footerButton} onClick={addTemplate}>
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