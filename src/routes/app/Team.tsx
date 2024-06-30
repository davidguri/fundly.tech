// import React from "react";
import styles from "./styles/Transactions.module.scss";
import Layout from "../../components/layout/Layout";

import { useNavigate } from "react-router-dom";

import { IoChevronBack } from "react-icons/io5";

export default function Team() {

  const nav = useNavigate();

  return (
    <>
      <Layout>
        <main className={styles.main}>
          <div className={styles.titleContainer}>
            <div className={styles.titleLeftContainer}>
              <div onClick={() => nav(-1)}>
                <IoChevronBack className="title" color="#533fd5" />
              </div>
              <text className="title">Team</text>
            </div>
          </div>
        </main>
      </Layout>
    </>
  )
}