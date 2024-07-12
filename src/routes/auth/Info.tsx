import React from "react";
import styles from "./styles/Info.module.scss";
import { useNavigate, useLocation } from "react-router-dom";
import User from "../../models/user.model";
import { Auth } from "../../controllers/auth.controller";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebase';

import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";

export default function Info() {

  function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

  let query = useQuery();

  const type = query.get("type");

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [business, setBusiness] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState<number>();

  const role = type === "0" ? "Owner" : type === "1" ? "Worker" : "Freelancer";

  const nav = useNavigate()

  const user: User = {
    id: "",
    role: role,
    displayName: name,
    email: email,
    business: type !== "1" ? business : "",
    photoUrl: "https://api.dicebear.com/7.x/big-ears-neutral/png?randomizeIds=true",
    currency: "ALL"
  }

  const signUp = async () => {
    await Auth.signUp(user, password, name, "https://api.dicebear.com/7.x/big-ears-neutral/png?randomizeIds=true").catch((error: any) => {
      alert(error.message);
    })
  }

  const checkPendingWorkers = async (email: string, authCode: number, businessId: string) => {
    try {
      // Get a reference to the specific business document
      const businessDocRef = doc(db, "businesses", businessId);
      const businessDocSnap = await getDoc(businessDocRef);

      if (businessDocSnap.exists()) {
        const businessData = businessDocSnap.data();
        let pendingWorkers = businessData.pendingWorkers || [];

        const updatedPendingWorkers = pendingWorkers.filter(worker => {
          return !(worker.email === email && worker.authCode === authCode);
        });

        await signUp().then(async () => {
          await updateDoc(businessDocRef, {
            pendingWorkers: updatedPendingWorkers
          });
          // console.log("Matching pending workers deleted successfully.");
        })
      } else {
        console.log("No such business document!");
      }
    } catch (error) {
      console.error("Error checking and deleting pending workers:", error);
    }
  };

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && type !== "0" || JSON.parse(localStorage.getItem("paymen_complete")) === true) {
        nav('/');
      }
    });

    return () => unsubscribe();

  }, [nav]);

  const handleContinue = async () => {
    await signUp().then(() => {
      localStorage.setItem("owner", JSON.stringify(false));
    })
  }

  const handleWorkerContinue = async () => {
    await checkPendingWorkers(email, code, business);
  }

  const handleOwnerContinue = async () => {
    if (!name || !email || !business || !password) {
      return;
    } else {
      await signUp().then(() => {
        localStorage.setItem("payment_complete", JSON.stringify(false));
        localStorage.setItem("owner", JSON.stringify(true));
        nav("/payment")
      });
    }
  }

  return (
    <>
      <main className={styles.main}>
        <text className={styles.title}>Create An Account.</text>
        <input className={styles.formInput} placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} type="text" />
        <input className={styles.formInput} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        {/* <div className={styles.formInput} style={{ paddingInline: 0, width: "100%" }}>
          <select name="Role" id="role" className={styles.select} onChange={handleRoleChange} value={role}>
            <option value="default">Role</option>
            <option value="Worker">Worker</option>
            <option value="Owner">Owner</option>
            <option value="Freelance">Freelance</option>
          </select>
        </div> */}
        <input className={styles.formInput} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        {
          type === "0" ? (
            <input className={styles.formInput} placeholder="Business Name" value={business} onChange={(e) => setBusiness(e.target.value)} type="text" />
          ) : (
            <>
              {
                type === "1" && (
                  <>
                    <input className={styles.formInput} placeholder="Business Name" value={business} onChange={(e) => setBusiness(e.target.value)} type="text" />
                    <input className={styles.formInput} placeholder="Code" value={code} onChange={(e) => setCode(parseInt(e.target.value))} type="number" inputMode="numeric" />
                  </>
                )
              }
            </>
          )
        }
        {
          type === "0" ? (
            <div className={styles.submitButton} onClick={handleOwnerContinue}>
              <text className={styles.submitButtonText}>Continue To Payment</text>
            </div>
          ) : (
            <div className={styles.submitButton} onClick={type === "1" ? handleWorkerContinue : handleContinue}>
              <text className={styles.submitButtonText}>Continue</text>
            </div>
          )
        }
      </main>
    </>
  );
}