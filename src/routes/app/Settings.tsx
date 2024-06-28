// import React from "react"
import styles from "./styles/Settings.module.scss"
import Layout from "../../components/layout/Layout"

import { useNavigate } from "react-router-dom"
import { IoChevronBack } from "react-icons/io5"

import { Auth } from "../../controllers/auth.controller"
// import { auth } from "../../../firebase"
// import { Firestore } from "../../controllers/firestore.controller"

export default function Settings() {

  const nav = useNavigate()
  // const uid = auth.currentUser.uid

  // const [user, setUser] = React.useState()

  const handleSignOut = async () => {
    return await Auth.signOut()
  }

  // const getUserData = async (uid: string) => {
  //   try {
  //     const data = await Firestore.getUserById(uid)
  //     setUser(data)
  //     console.log(data)
  //   } catch (error: any) {
  //     alert(error.message)
  //   }
  // }

  // getUserData("6pb43Y5aP8fNxlQnmqvYoUSMFXF3")

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
              {/* <text className={styles.buttonText} style={{ color: "#e5e4ec" }}>{user.name}</text> */}
            </div>
            <div className={styles.bottomContainer}>
              <div className={styles.button} style={{ backgroundColor: "#533fd5" }} onClick={handleSignOut}>
                <text className={styles.buttonText} style={{ color: "#e5e4ec" }}>Log Out</text>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
}