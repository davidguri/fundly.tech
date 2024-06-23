import styles from "./styles/Transactions.module.scss";
import Layout from "../../components/layout/Layout";

import { useNavigate } from "react-router-dom";

import Transaction from "../../components/global/Transaction.component";

import { IoChevronBack } from "react-icons/io5";

export default function Transactions() {

  const nav = useNavigate();

  return (
    <>
      <Layout>
        <main className={styles.main}>
          <div className={styles.titleContainer}>
            <div onClick={() => nav(-1)}>
              <IoChevronBack className="title" color="#533fd5" />
            </div>
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