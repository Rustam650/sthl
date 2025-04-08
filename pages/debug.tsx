import Head from 'next/head';
import styles from '../styles/Layout.module.css';
import commonStyles from '../styles/common.module.css';

export default function Debug() {
  return (
    <div>
      <Head>
        <title>Debug Page</title>
      </Head>
      <div>
        <h1>Debug CSS Modules</h1>
        <pre>{JSON.stringify(styles, null, 2)}</pre>
        <pre>{JSON.stringify(commonStyles, null, 2)}</pre>
      </div>
    </div>
  );
}
