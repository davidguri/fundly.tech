import styles from "./styles/Root.module.scss";
import Layout from "../../components/layout/Layout";

import { IoArrowForward, IoAdd, IoCalendar, IoRepeat, IoWallet } from "react-icons/io5";

import Svg from "../../assets/react.svg";

export default function Root() {
  return (
    <>
      <Layout>
        <main className={styles.main}>
          <section className={styles.topSection}>
            <div className={styles.topContainer}>
              <div className={styles.titleContainer}>
                <text className={styles.subtitle}>Current Month</text>
                <text className={styles.title}>$200,5</text>
              </div>
              <div className={styles.profileContainer}>
                <img src={Svg} className={styles.profileImage} alt="profile_image" />
              </div>
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
              <IoAdd size={45} />
            </div>
            <div className={styles.buttonContainer}>
              <IoRepeat className={styles.buttonIcon} />
            </div>
            <div className={styles.buttonContainer}>
              <IoArrowForward className={styles.buttonIcon} />
            </div>
          </section>
        </main>
      </Layout>
    </>
  );
}