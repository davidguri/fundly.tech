import React from "react";
import styles from "./styles/Signup.module.scss";
import { useNavigate } from "react-router-dom";
// import User from "../../models/user.model";
// import { Auth } from "../../controllers/auth.controller";
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from '../../../firebase';
// import { Firestore } from "../../controllers/firestore.controller";
import { IoBusiness, IoPeople, IoPerson } from "react-icons/io5";

export default function Signup() {

  // const [name, setName] = React.useState("");
  // const [email, setEmail] = React.useState("");
  // const [role, setRole] = React.useState("default");
  // const [business, setBusiness] = React.useState("");
  // const [password, setPassword] = React.useState("");

  // const handleRoleChange = (e: any) => {
  //   try {
  //     setRole(e.target.value)
  //     // console.log(role)
  //   } catch (error: any) {
  //     alert(error.message)
  //   }
  // }

  const nav = useNavigate()

  // const [businesses, setBusinesses] = React.useState([])

  // const getBusinesses = async () => {
  //   try {
  //     setBusinesses([]);
  //     const data = await Firestore.getAllBusinesses()
  //     setBusinesses(data)
  //   } catch (error: any) {
  //     alert(error.message)
  //   }
  // }

  // const handleBusinessChange = (e: any) => {
  //   try {
  //     setBusiness(e.target.value)
  //     // console.log(business)
  //   } catch (error: any) {
  //     alert(error.message)
  //   }
  // }

  // const user: User = {
  //   id: "",
  //   role: role,
  //   displayName: name,
  //   email: email,
  //   business: business,
  //   photoUrl: "https://api.dicebear.com/7.x/big-ears-neutral/png?randomizeIds=true",
  //   currency: "ALL"
  // }

  // const signUp = async () => {
  //   await Auth.signUp(user, password, name, "https://api.dicebear.com/7.x/big-ears-neutral/png?randomizeIds=true").catch((error: any) => {
  //     console.error(error.message);
  //   })
  // }

  // React.useEffect(() => {
  //   getBusinesses()

  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       nav('/');
  //     }
  //   });

  //   return () => unsubscribe();

  // }, [nav]);

  const [selected, setSelected] = React.useState("-")

  const handleChangeSelected = (id: string) => {
    setSelected(id);
  }

  const handleContinue = () => {
    nav(`/info?type=${selected}`)
  }

  return (
    <>
      <main className={styles.main}>
        <text className={styles.title}>Let's Get Started!</text>
        <text className={styles.subtitle}>The custom tool to manage your business' cash payments!</text>
        <section className={styles.selectSection}>
          <div className={`${styles.selectContainer} ${selected === "0" ? styles.selectedContainer : ""}`} onClick={() => handleChangeSelected("0")}>
            <IoBusiness size={32} className={styles.selectTitle} />
            <text className={styles.selectTitle}>Owner</text>
          </div>
          <div className={`${styles.selectContainer} ${selected === "1" ? styles.selectedContainer : ""}`} onClick={() => handleChangeSelected("1")}>
            <IoPeople size={32} className={styles.selectTitle} />
            <text className={styles.selectTitle}>Worker</text>
          </div>
          <div className={`${styles.selectContainer} ${selected === "2" ? styles.selectedContainer : ""}`} onClick={() => handleChangeSelected("2")}>
            <IoPerson size={32} className={styles.selectTitle} />
            <text className={styles.selectTitle}>Freelance</text>
          </div>
        </section>
        {/* <input className={styles.formInput} placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} type="text" />
        <input className={styles.formInput} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        <div className={styles.formInput} style={{ paddingInline: 0, width: "100%" }}>
          <select name="Role" id="role" className={styles.select} onChange={handleRoleChange} value={role}>
            <option value="default">Role</option>
            <option value="Worker">Worker</option>
            <option value="Owner">Owner</option>
            <option value="Freelance">Freelance</option>
          </select>
        </div>
        {
          role === "Owner" || role === "Freelance" ? (
            <input className={styles.formInput} placeholder="Business" value={business} onChange={(e) => setBusiness(e.target.value)} type="text" />
          ) : (
            <div className={styles.formInput} style={{ paddingInline: 0, width: "100%" }}>
              <select name="Role" id="role" className={styles.select} onChange={handleBusinessChange} value={business}>
                <option value="Business">Business</option>
                {businesses.map((business, i) => {
                  return (
                    <option key={i} value={business.businessName}>{business.businessName}</option>
                  )
                })}
              </select>
            </div>
          )
        }
        <input className={styles.formInput} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" /> */}
        <div className={styles.submitButton} onClick={handleContinue}>
          <text className={styles.submitButtonText}>Continue</text>
        </div>
        <text className={styles.alternativeText}>Already have an account? <span className="specialText" style={{ fontWeight: "800" }} onClick={() => nav("/login")}>Log In.</span></text>
      </main>
    </>
  );
}