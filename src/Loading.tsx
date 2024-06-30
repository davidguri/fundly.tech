import styles from './Loading.module.scss';

import { IoReload } from 'react-icons/io5';

export default function Loading() {
  return (
    <>
      <main className={styles.main}>
        <text className={styles.logo}>Fundly</text>
        <IoReload size={36} className={styles.reload} />
      </main>
    </>
  );
};
