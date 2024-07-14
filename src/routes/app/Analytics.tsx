// import React from "react"
import styles from "./styles/Settings.module.scss"
import Layout from "../../components/layout/Layout"

import { useNavigate } from "react-router-dom"
import { IoChevronBack } from "react-icons/io5"

export default function Analytics() {

  const nav = useNavigate()

  return (
    <>
      <Layout>
        <main className={styles.main}>
          <div className={styles.titleContainer}>
            <div className={styles.leftTitleContainer}>
              <div onClick={() => nav(-1)}>
                <IoChevronBack className="title" color="#533fd5" />
              </div>
              <text className="title">Analytics</text>
            </div>
          </div>
          <div className={styles.content}>
          </div>
        </main>
      </Layout>
    </>
  );
}