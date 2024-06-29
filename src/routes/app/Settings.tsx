import React from "react"
import styles from "./styles/Settings.module.scss"
import Layout from "../../components/layout/Layout"

import { useNavigate } from "react-router-dom"
import { IoChevronBack } from "react-icons/io5"

import { Auth } from "../../controllers/auth.controller"
import { Firestore } from "../../controllers/firestore.controller"
import { getAuth } from "firebase/auth"
import User from "../../models/user.model"

export default function Settings() {

  const auth = getAuth()
  // console.log(auth.currentUser.email)

  const nav = useNavigate()

  const [user, setUser] = React.useState({})


  const handleSignOut = async () => {
    return await Auth.signOut()
  }

  const getUserData = async () => {
    try {
      const data = await Firestore.getUserById(auth.currentUser.uid)
      console.log(data)
      setUser(data[0])
      console.log(user)
    } catch (error: any) {
      alert(error.message)
    }
  }

  React.useEffect(() => {
    getUserData()
  }, []);

  const [currency, setCurrency] = React.useState("ALL")

  const handleCurrencyChange = (e: any) => {
    setCurrency(e.target.value)
  }

  const userData: User = {
    id: auth.currentUser.uid,
    displayName: "user",
    email: auth.currentUser.email,
    currency: currency,
    photoUrl: "https://api.dicebear.com/7.x/big-ears-neutral/png?randomizeIds=true"
  }

  const handleUpdate = async () => {
    await Firestore.updateUserData(auth.currentUser.uid, userData)
    alert("Changes Saved!")
  }

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
                  <img src="https://api.dicebear.com/7.x/big-ears-neutral/png?randomizeIds=true" className={styles.accountImage} alt="account_image" />
                </div>
                <div className={styles.accountInfoContainer}>
                  <text className={styles.accountInfoText}>user</text>
                  <text className={styles.accountInfoTextAlt}>{auth.currentUser.email}</text>
                </div>
              </div>
              <div className={styles.setting}>
                <text className={styles.settingText}>Currency</text>
                <select name="Currency" id="currency" className={styles.select} onChange={handleCurrencyChange} value={currency}>
                  <option value="ALL">ALL</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>
            <div className={styles.bottomContainer}>
              <div className={styles.button} style={{ backgroundColor: "#aea9cb", boxShadow: "0px 0px 12px rgba(174, 169, 203, 0.75)" }} onClick={handleUpdate}>
                <text className={styles.buttonText} style={{ color: "#0a0a0f" }}>Save Changes</text>
              </div>
              <div className={styles.button} onClick={handleSignOut}>
                <text className={styles.buttonText}>Log Out</text>
              </div>
              <text className={styles.supportText}>Made with 💜 By <a href="https://buymeacoffee.com/davidguri" target="_blank" rel="noopener noreferrer" className="link" style={{ textDecoration: "underline", textDecorationColor: "#aea9cb" }}>David Guri</a></text>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
}