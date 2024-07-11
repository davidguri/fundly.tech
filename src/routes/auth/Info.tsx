import React from "react";
import styles from "./styles/Info.module.scss";
import { useNavigate, useLocation } from "react-router-dom";
import User from "../../models/user.model";
import { Auth } from "../../controllers/auth.controller";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebase';

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

  const role = type === "0" ? "Owner" : type === "1" ? "Freelance" : "Worker"

  const nav = useNavigate()

  const user: User = {
    id: "",
    role: role,
    displayName: name,
    email: email,
    business: business,
    photoUrl: "https://api.dicebear.com/7.x/big-ears-neutral/png?randomizeIds=true",
    currency: "ALL"
  }

  const signUp = async () => {
    await Auth.signUp(user, password, name, "https://api.dicebear.com/7.x/big-ears-neutral/png?randomizeIds=true").catch((error: any) => {
      alert(error.message);
    })
  }

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        nav('/');
      }
    });

    return () => unsubscribe();

  }, [nav]);

  const handleContinue = async () => {
    type === "0" ? {} : await signUp()
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
                type === "1" && <text className={styles.formText}>Put the auth code here bruh</text>
              }
            </>
          )
        }
        {
          type === "0" ? (
            <a href="https://www.paypal.com/ncp/payment/8D2KU8HBG3M2S" className="link" target="_blank">
              <div className={styles.submitButton}>
                <text className={styles.submitButtonText}>Continue To Payment</text>
              </div>
            </a>
          ) : (
            <div className={styles.submitButton} onClick={handleContinue}>
              <text className={styles.submitButtonText}>Continue</text>
            </div>
          )
        }
      </main>
    </>
  );
}