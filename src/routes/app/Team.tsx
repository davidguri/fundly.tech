import React from "react";
import styles from "./styles/Team.module.scss";
import Layout from "../../components/layout/Layout";

import { useNavigate } from "react-router-dom";

import { IoChevronBack } from "react-icons/io5";

import { Firestore } from "../../controllers/firestore.controller";
import { getAuth } from "firebase/auth";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";

export default function Team() {

  const auth = getAuth()

  const nav = useNavigate();

  const [workersData, setWorkersData] = React.useState([]);

  const getWorkerData = async (workerId: string): Promise<any> => {
    const data = await Firestore.getUserById(workerId);
    return data
  }

  const getWorkerIds = async () => {
    try {
      const q = query(collection(db, "businesses"), where("owner", "==", auth.currentUser.uid));

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        ...doc.data()
      }))
      console.log(data[0].workers)
      const userDataPromises = data[0].workers.map(workerId => getWorkerData(workerId));
      const userDataResults = await Promise.all(userDataPromises);

      const validUserData = userDataResults.filter(userData => userData !== null);
      setWorkersData(validUserData);
    } catch (error: any) {
      console.log(error.message)
    }
  }

  React.useEffect(() => {
    getWorkerIds()
  }, [])

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
          <div className={styles.workersContainer}>
            {workersData.map((worker, i) => {
              return (
                <div className={styles.worker} key={i}>
                  <text className={styles.workerTitle}>{worker.displayName}</text>
                </div>
              )
            })}
          </div>
        </main>
      </Layout>
    </>
  )
}