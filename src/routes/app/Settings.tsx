import React from "react"
import styles from "./styles/Settings.module.scss"
import Layout from "../../components/layout/Layout"

import { useNavigate } from "react-router-dom"
import { IoChevronBack } from "react-icons/io5"

import { Auth } from "../../controllers/auth.controller"
import { Firestore } from "../../controllers/firestore.controller"
import { getAuth } from "firebase/auth"
import User from "../../models/user.model"

import { IoHelpCircle, IoCheckmarkCircle } from "react-icons/io5";

export default function Settings() {

  const auth = getAuth()

  const nav = useNavigate()

  const [user, setUser]: any = React.useState([])

  const handleSignOut = async () => {
    return await Auth.signOut()
  }

  const getUserData = async () => {
    const data = await Firestore.getUserById(auth.currentUser.uid)
    setUser(data);
  }

  React.useEffect(() => {
    getUserData()
  }, []);

  const [currency, setCurrency] = React.useState(user.currency)

  const handleCurrencyChange = (e: any) => {
    try {
      setCurrency(e.target.value)
      // console.log(currency)
    } catch (error: any) {
      alert(error.message)
    }
  }

  const userData: User = {
    id: auth.currentUser.uid,
    role: user.role,
    business: user.business,
    displayName: user.displayName,
    email: auth.currentUser.email,
    currency: currency,
    photoUrl: user.photoUrl
  }

  const handleUpdate = async () => {
    setShow(false)
    await Firestore.updateUserData(auth.currentUser.uid, userData)
    getUserData()
  }

  const [show, setShow] = React.useState(false);
  const [status, setStatus] = React.useState("question");

  return (
    <>
      <Layout>
        <main className={styles.main}>
          <div className={styles.titleContainer}>
            <div onClick={() => nav(-1)}>
              <IoChevronBack className="title" color="#533fd5" />
            </div>
            <text className="title">Settings</text>
          </div>
          <div className={styles.content}>
            <div className={styles.topContainer}>
              <div className={styles.accountContainer}>
                <div className={styles.accountImageContainer}>
                  <img src={user.photoUrl} className={styles.accountImage} />
                </div>
                <div className={styles.accountInfoContainer}>
                  <text className={styles.accountInfoText}>{auth.currentUser.displayName} - {user.role}</text>
                  <text className={styles.accountInfoTextAlt}>{auth.currentUser.email}</text>
                </div>
              </div>
              <div className={styles.setting}>
                <text className={styles.settingText}>Business</text>
                <text className={styles.settingText} style={{ color: "#533fd5" }}>{user.business}</text>
              </div>
              <div className={styles.setting}>
                <text className={styles.settingText}>Currency</text>
                <select name="Currency" id="currency" className={styles.select} onChange={handleCurrencyChange} value={currency}>
                  <option value="ALL">ALL</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="CAD">CAD</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              <div className={styles.setting}>
                <text className={styles.settingText}>About The Dev</text>
                <text className={styles.settingText} style={{ color: "#533fd5" }}><a href="https://www.buymeacoffee.com/davidguri" target="_blank" className="link">Site</a></text>
              </div>
              <text className={styles.explainText}>Note: This app is still in development, and you are among the few testing it. We aim to provide the best experience, so please reach out via <a href="mailto:david@davidguri.com" style={{ color: "#533fd5", textDecoration: "none" }}>email</a> with any issues.</text>
            </div>
            <div className={styles.bottomContainer}>
              <div className={styles.button} style={{ backgroundColor: "#aea9cb" }} onClick={() => { (currency !== user.currency) ? setShow(true) : setStatus("question") }}>
                <text className={styles.buttonText} style={{ color: "#0a0a0f" }}>Save Changes</text>
              </div>
              <div className={styles.button} onClick={handleSignOut}>
                <text className={styles.buttonText}>Log Out</text>
              </div>
              <text className={styles.supportText}>Made with 💜 By David Guri</text>
            </div>
          </div>
        </main>
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
            <div className={styles.footerButton} onClick={handleUpdate}>
              <text className={styles.footerButtonText}>{status === "question" ? "Confirm" : "Done"}</text>
            </div>
            <text className={styles.footerCancelText} onClick={() => setShow(false)} style={{ color: "#533fd5" }}>Cancel</text>
          </div>
        </section>
      </Layout>
    </>
  );
}