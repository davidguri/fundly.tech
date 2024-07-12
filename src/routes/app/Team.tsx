import React from "react";
import styles from "./styles/Team.module.scss";
import Layout from "../../components/layout/Layout";

import { Link, useNavigate } from "react-router-dom";

import { IoChevronBack, IoAddCircle } from "react-icons/io5";

import { Firestore } from "../../controllers/firestore.controller";
import { getAuth } from "firebase/auth";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";

import Loader from "../../components/global/Loader.component";

export default function Team() {

  const auth = getAuth();

  const [loading, setLoading] = React.useState(true);

  const nav = useNavigate();

  const [workersData, setWorkersData] = React.useState([]);
  const [pendingWorkersData, setPendingWorkersData] = React.useState([]);

  const getWorkerData = async (workerId: string): Promise<any> => {
    const data = await Firestore.getUserById(workerId);
    return data
  }

  const [user, setUser]: any = React.useState([])

  const getUserData = async (): Promise<any> => {
    const data = await Firestore.getUserById(auth.currentUser.uid);
    setUser(data);
  }

  const getWorkerIds = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }

  const getPendingWorkers = async () => {
    setLoading(true);
    try {
      const businessesQuery = query(
        collection(db, "businesses"),
        where("owner", "==", auth.currentUser.uid)
      );
      let pendingWorkersData = []

      const businessesSnapshot = await getDocs(businessesQuery);

      businessesSnapshot.forEach(businessDoc => {
        const businessData = businessDoc.data();
        const pendingWorkers = businessData.pendingWorkers;

        pendingWorkersData.push(...pendingWorkers);
      });
      console.log(pendingWorkersData);
      setPendingWorkersData(pendingWorkersData)
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    getUserData()
    getWorkerIds()
    getPendingWorkers()
  }, [])

  const [option, setOption] = React.useState("0")

  const selectOptionHandler = (option: string) => {
    setOption(option)
  }

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
            <Link to="/add_member" style={{ textDecoration: "none", color: "inherit" }}>
              <IoAddCircle className="title" color="#533fd5" />
            </Link>
          </div>
          <div className={styles.chipContainer}>
            <div className={`${styles.chip} ${option === "0" ? styles.selectedChip : ""}`} onClick={() => selectOptionHandler("0")}>
              <text className={styles.chipText}>All</text>
            </div>
            <div className={`${styles.chip} ${option === "1" ? styles.selectedChip : ""}`} onClick={() => selectOptionHandler("1")}>
              <text className={styles.chipText}>Active</text>
            </div>
            <div className={`${styles.chip} ${option === "2" ? styles.selectedChip : ""}`} onClick={() => selectOptionHandler("2")}>
              <text className={styles.chipText}>Pending</text>
            </div>
          </div>
          <div className={styles.workersContainer}>
            {
              option === "0" ? (
                <>
                  <div className={styles.worker}>
                    <text className={styles.workerTitle}>You - {user.displayName}</text>
                    <text className={styles.workerTitle} style={{ color: "#533fd5" }}>Active</text>
                  </div>
                  {
                    loading && <Loader />
                  }
                  {workersData.map((worker, i) => {
                    return (
                      <div className={styles.worker} key={i}>
                        <text className={styles.workerTitle}>{worker.displayName}</text>
                        <text className={styles.workerTitle} style={{ color: "#533fd5" }}>Active</text>
                      </div>
                    )
                  })}
                  {pendingWorkersData.map((pendingWorker, i) => {
                    return (
                      <div className={styles.pendingWorker} key={i}>
                        <div className={styles.pendingWorkerTopContainer}>
                          <text className={styles.pendingWorkerTitle}>{pendingWorker.name}</text>
                          <text className={styles.pendingWorkerTitle} style={{ color: "#533fd5" }}>Pending</text>
                        </div>
                        <div className={styles.pendingWorkerBottomContainer}>
                          <text className={styles.pendingWorkerText}>{pendingWorker.email}</text>
                        </div>
                      </div>
                    )
                  })}
                </>
              ) : (
                option === "1" ? (
                  <>
                    <div className={styles.worker}>
                      <text className={styles.workerTitle}>You - {user.displayName}</text>
                      <text className={styles.workerTitle} style={{ color: "#533fd5" }}>Active</text>
                    </div>
                    {workersData.map((worker, i) => {
                      return (
                        <div className={styles.worker} key={i}>
                          <text className={styles.workerTitle}>{worker.displayName}</text>
                          <text className={styles.workerTitle} style={{ color: "#533fd5" }}>Active</text>
                        </div>
                      )
                    })}
                  </>
                ) : (
                  <>
                    {pendingWorkersData.map((pendingWorker, i) => {
                      return (
                        <div className={styles.pendingWorker} key={i}>
                          <div className={styles.pendingWorkerTopContainer}>
                            <text className={styles.pendingWorkerTitle}>{pendingWorker.name}</text>
                            <text className={styles.pendingWorkerTitle} style={{ color: "#533fd5" }}>Pending</text>
                          </div>
                          <div className={styles.pendingWorkerBottomContainer}>
                            <text className={styles.pendingWorkerText}>{pendingWorker.email}</text>
                          </div>
                        </div>
                      )
                    })}
                  </>
                )
              )
            }
          </div>
        </main>
      </Layout>
    </>
  )
}