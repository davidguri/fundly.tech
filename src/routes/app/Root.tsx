import styles from "./styles/Root.module.scss";
import Layout from "../../components/layout/Layout";
import { Link } from "react-router-dom";

import { IoAdd, IoCalendar, IoRepeat, IoWallet, IoSettings } from "react-icons/io5";

export default function Root() {
  return (
    <>
      <Layout>
        <main className={styles.main}>
          <section className={styles.topSection}>
            <div className={styles.titleContainer}>
              <text className="subtitle">Current Month</text>
              <text className="title">$1,004.5</text>
            </div>
          </section>
          <section className={styles.bottomSection}>
            <div className={styles.buttonContainer}>
              <IoWallet className={styles.buttonIcon} />
            </div>
            <div className={styles.buttonContainer}>
              <IoCalendar className={styles.buttonIcon} />
            </div>
            <div className={styles.buttonContainer}>
              <IoSettings className={styles.buttonIcon} />
            </div>
            <Link to="/transactions" className={`${styles.buttonContainer} ${"link"}`}>
              <div className={styles.buttonContainer}>
                <IoRepeat className={styles.buttonIcon} />
              </div>
            </Link>
            <div className={styles.buttonContainer}>
              <IoAdd className={styles.buttonIcon} />
            </div>
          </section>
        </main>
      </Layout>
    </>
  );
}