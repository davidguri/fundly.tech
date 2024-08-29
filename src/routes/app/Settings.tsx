import React from "react";
import Layout from "../../components/layout/Layout";
import styles from "./styles/Settings.module.scss";

import { IoChevronBack, IoSave } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";

import { getAuth } from "firebase/auth";
import { Auth } from "../../controllers/auth.controller";
import { Firestore } from "../../controllers/firestore.controller";
import User from "../../models/user.model";

import { IoCheckmarkCircle, IoHelpCircle } from "react-icons/io5";

export default function Settings() {
  const auth = getAuth();

  const nav = useNavigate();

  const [user, setUser]: any = React.useState([]);

  const handleSignOut = async () => {
    return await Auth.signOut();
  };

  const userLocal = JSON.parse(localStorage.getItem("userData")) || {
    role: "Freelancer",
    business: "",
    displayName: "",
    email: "",
    currency: "ALL",
    photoUrl: "",
  };

  const getUserData = async () => {
    const data = await Firestore.getUserById(auth.currentUser.uid);
    setUser(data);
  };

  React.useEffect(() => {
    getUserData();
  }, []);

  const [currency, setCurrency] = React.useState<string>();

  const handleCurrencyChange = (e: any) => {
    try {
      setCurrency(e.target.value);
      // console.log(currency)
    } catch (error: any) {
      alert(error.message);
    }
  };

  const userData: User = {
    id: auth.currentUser.uid,
    role: user.role,
    business: user.business,
    displayName: user.displayName,
    email: auth.currentUser.email,
    currency: currency,
    photoUrl: user.photoUrl,
  };

  const handleUpdate = async () => {
    setShow(false);
    await Firestore.updateUserData(auth.currentUser.uid, userData);
    getUserData();
  };

  const [show, setShow] = React.useState(false);
  const [status, setStatus] = React.useState("question");

  // const plans = {
  //   starter: "P-9GP57167MX0059824M2H7FIA",
  //   plus: "P-5P504453PS770450NM2H7F5I",
  //   pro: "P-94R91105AE452244SM2H7GMI",
  // };

  // const userPlan =
  //   user.membership === plans.starter || userLocal.membership === plans.starter
  //     ? "Starter"
  //     : user.membership === plans.plus || userLocal.membership === plans.plus
  //       ? "Plus"
  //       : "Pro";

  return (
    <>
      <Layout>
        <main className={styles.main}>
          <div className={styles.titleContainer}>
            <div className={styles.leftTitleContainer}>
              <div onClick={() => nav(-1)}>
                <IoChevronBack className="title" color="#533fd5" />
              </div>
              <text className="title">Settings</text>
            </div>
            <div
              style={{ textDecoration: "none", color: "inherit" }}
              onClick={() => {
                currency !== userLocal.currency || currency !== user.currency
                  ? setShow(true)
                  : setStatus("question");
              }}
            >
              <IoSave className="title" color="#533fd5" size={30} />
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.topContainer}>
              <div className={styles.accountContainer}>
                <div className={styles.accountImageContainer}>
                  <img
                    src={auth.currentUser.photoURL}
                    className={styles.accountImage}
                  />
                </div>
                <div className={styles.accountInfoContainer}>
                  <text className={styles.accountInfoText}>
                    {auth.currentUser.displayName} -{" "}
                    {user.role || userLocal.role}
                  </text>
                  <text className={styles.accountInfoTextAlt}>
                    {auth.currentUser.email}
                  </text>
                </div>
              </div>
              {(userLocal.role || user.role) !== "Freelancer" && (
                <div className={styles.setting}>
                  <text className={styles.settingText}>Business</text>
                  <text
                    className={styles.settingText}
                    style={{ color: "#533fd5" }}
                  >
                    {user.business || userLocal.business}
                  </text>
                </div>
              )}
              <div className={styles.setting}>
                <text className={styles.settingText}>Team Members</text>
                <text
                  className={styles.settingText}
                  style={{ color: "#533fd5" }}
                >
                  <Link to="/team" className="link">
                    View
                  </Link>
                </text>
              </div>
              {/*{(userLocal.role || user.role) !== "Worker" && (
                <div className={styles.setting}>
                  <text className={styles.settingText}>Membership Plan</text>
                  <text
                    className={styles.settingText}
                    style={{ color: "#533fd5" }}
                  >
                    {userLocal.royalty
                      ? "Royalty"
                      : user.membership || userLocal.membership
                        ? userPlan
                        : "Freelancer"}
                  </text>
                </div>
              )}*/}
              <div className={styles.setting}>
                <text className={styles.settingText}>Currency</text>
                <select
                  name="Currency"
                  id="currency"
                  className={styles.select}
                  onChange={handleCurrencyChange}
                  value={currency || user.currency || userLocal.currency}
                >
                  <option value="ALL">ALL</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="CAD">CAD</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              <div className={styles.setting}>
                <text className={styles.settingText}>Feature Voting</text>
                <text
                  className={styles.settingText}
                  style={{ color: "#533fd5" }}
                >
                  <Link to="/vote" className="link">
                    Vote
                  </Link>
                </text>
              </div>
              <div className={styles.setting}>
                <text className={styles.settingText}>About The Dev</text>
                <text
                  className={styles.settingText}
                  style={{ color: "#533fd5" }}
                >
                  <a
                    href="https://www.davidguri.com/"
                    target="_blank"
                    className="link"
                  >
                    Site
                  </a>
                </text>
              </div>
            </div>
            <div className={styles.bottomContainer}>
              <div className={styles.button} onClick={handleSignOut}>
                <text className={styles.buttonText}>Log Out</text>
              </div>
              <text className={styles.supportText}>
                Made with 💜 By David Guri
              </text>
            </div>
          </div>
        </main>
        <section
          className={styles.footer}
          style={{ display: `${show ? "flex" : "none"}` }}
        >
          <div className={styles.footerTopContainer}>
            <text className={styles.footerTitle}>
              {status === "question" ? "Confirm Operation?" : "Success!"}
            </text>
            <text className={styles.footerSubtitle}>
              {status === "question"
                ? "Are you sure you want to continue?"
                : "Operation completed successfully!"}
            </text>
          </div>
          <div className={styles.footerMiddleContainer}>
            {status === "question" ? (
              <IoHelpCircle size={104} color="#533fd5" />
            ) : (
              <IoCheckmarkCircle size={96} color="#533fd5" />
            )}
          </div>
          <div className={styles.footerBottomContainer}>
            <div className={styles.footerButton} onClick={handleUpdate}>
              <text className={styles.footerButtonText}>
                {status === "question" ? "Confirm" : "Done"}
              </text>
            </div>
            <text
              className={styles.footerCancelText}
              onClick={() => setShow(false)}
              style={{ color: "#533fd5" }}
            >
              Cancel
            </text>
          </div>
        </section>
      </Layout>
    </>
  );
}
