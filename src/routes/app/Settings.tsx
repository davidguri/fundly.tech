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

  const [user, setUser]: any = React.useState([])

  const handleSignOut = async () => {
    return await Auth.signOut()
  }

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
    await Firestore.updateUserData(auth.currentUser.uid, userData)
    alert("Changes Saved!")
    getUserData()
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
            </div>
            <div className={styles.bottomContainer}>
              <div className={styles.button} style={{ backgroundColor: "#aea9cb" }} onClick={handleUpdate}>
                <text className={styles.buttonText} style={{ color: "#0a0a0f" }}>Save Changes</text>
              </div>
              <div className={styles.button} onClick={handleSignOut}>
                <text className={styles.buttonText}>Log Out</text>
              </div>
              <text className={styles.supportText}>Made with 💜 By David Guri</text>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
}