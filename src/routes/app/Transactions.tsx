import styles from "./styles/Transactions.module.scss";
import Layout from "../../components/layout/Layout";

import Transaction from "../../components/global/Transaction.component";

import { IoChevronBack } from "react-icons/io5";

export default function Transactions() {
  return (
    <>
      <Layout>
        <main className={styles.main}>
          <div className={styles.titleContainer}>
            <a href="/home" className="link">
              <IoChevronBack className="title" color="#533fd5" />
            </a>
            <text className="title">All Activity</text>
          </div>
          <div className={styles.transactionsContainer}>
            <Transaction incoming={true} date="Aug 12th, 2024, 14:08" type="Transaction" name="David Guri" amount="$25.00" />
            <Transaction incoming={true} date="Aug 12th, 2024, 14:08" type="Transaction" name="David Guri" amount="$25.00" />
            <Transaction incoming={true} date="Aug 12th, 2024, 14:08" type="Transaction" name="David Guri" amount="$25.00" />
          </div>
        </main>
      </Layout>
    </>
  )
}