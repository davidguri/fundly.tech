import styles from "./styles/Payment.module.scss";
import PayPalButton from "../../components/PayPalButton";

export default function Payment() {

  const plans = {
    starter: 'P-9GP57167MX0059824M2H7FIA',
    plus: 'P-5P504453PS770450NM2H7F5I',
    pro: 'P-94R91105AE452244SM2H7GMI'
  };

  return (
    <>
      <main className={styles.main}>
        <text className={styles.title}>Choose a Plan</text>
        <section className={styles.subscriptionSection}>
          <div className={styles.planContainer}>
            <div className={styles.plan}>
              <text className={styles.sectionTitle}>Starter Plan</text>
              <PayPalButton planId={plans.starter} />
            </div>
            <div className={styles.plan}>
              <text className={styles.sectionTitle}>Plus Plan</text>
              <PayPalButton planId={plans.plus} />
            </div>
            <div className={styles.plan}>
              <text className={styles.sectionTitle}>Pro Plan</text>
              <PayPalButton planId={plans.pro} />
            </div>
          </div>
        </section>
      </main>
    </>
  )
}