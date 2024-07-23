import React from "react";
import styles from "./styles/Vote.module.scss";

import { useNavigate } from "react-router-dom"
import { IoChevronBack, IoCheckmarkCircle, IoArrowUp, IoAlertCircle } from "react-icons/io5"

import { collection, getDocs, query, doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { getAuth } from "firebase/auth";

export default function Vote() {

  const auth = getAuth();

  const nav = useNavigate()

  const [features, setFeatures] = React.useState([])

  const fetchFeatures = async () => {
    try {
      setFeatures([])
      const q = query(collection(db, "features"))

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        ...doc.data()
      }))

      const sortedFeatures = data.sort((a, b) => b.count - a.count)

      setFeatures(sortedFeatures);
      // console.log(transactions)
    } catch (error: any) {
      alert("Error: " + error.message)
    }
  }

  const [status, setStatus] = React.useState(false);

  const manipulateCount = async (id: string, newCount: number) => {
    setStatus(false)
    const featureDocRef = doc(db, "features", id);

    try {
      const featureDoc = await getDoc(featureDocRef);

      if (featureDoc.exists()) {
        const featureData = featureDoc.data();
        const votedBy = featureData['votedBy'] || [];

        if (!votedBy.includes(auth.currentUser.uid)) {
          await updateDoc(featureDocRef, {
            count: newCount,
            votedBy: arrayUnion(auth.currentUser.uid),
          });
          fetchFeatures()
        } else {
          console.log("User has already voted for this feature.");
        }
      } else {
        alert("No such document!");
      }
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  }

  React.useEffect(() => {
    fetchFeatures();
  }, [])

  const [show, setShow] = React.useState(false);

  return (
    <>
      <main className={styles.main}>
        <div className={styles.titleContainer}>
          <div onClick={() => nav(-1)}>
            <IoChevronBack className="title" color="#533fd5" />
          </div>
          <text className="title">Vote</text>
        </div>
        <div className={styles.content}>
          <text className={styles.explainText}>Vote for features you'd like to see in the next update.</text>
          {features.map((feature, i) => {
            return (
              <>
                <div className={styles.featureContainer} key={i}>
                  <div className={styles.featureLeftContainer}>
                    <text className={styles.featureTitle}>{feature.title}</text>
                    <text className={styles.featureSubtitle}>{feature.subtitle}</text>
                  </div>
                  <div className={styles.featureRightContainer}>
                    <text className={styles.featureCount}>{feature.count}</text>
                    <div className={styles.featureVoteContainer}>
                      <IoArrowUp className={styles.featureVoteIcon} onClick={() => feature.votedBy.includes(auth.currentUser.uid) ? (setShow(true), setStatus(false)) : (setShow(true), setStatus(true))} />
                    </div>
                  </div>
                </div>
                <section className={styles.footer} style={{ display: `${show ? "flex" : "none" || "none"}` }}>
                  <div className={styles.footerTopContainer}>
                    <text className={styles.footerTitle}>{status ? "Success!" : "Sorry!"}</text>
                    <text className={styles.footerSubtitle}>{status ? "Are you sure you want to continue?" : "You've already voted for this feature"}</text>
                  </div>
                  <div className={styles.footerMiddleContainer}>
                    {
                      status ? (
                        <IoCheckmarkCircle size={104} color="#533fd5" />
                      ) : (
                        <IoAlertCircle size={96} color="#533fd5" />
                      )
                    }
                  </div>
                  <div className={styles.footerBottomContainer}>
                    <div className={styles.footerButton} onClick={() => { setShow(false); setStatus(false); manipulateCount(feature.id, feature.count + 1) }}>
                      <text className={styles.footerButtonText}>Done</text>
                    </div>
                  </div>
                </section>
              </>
            )
          })}
        </div>
      </main>
    </>
  )
}