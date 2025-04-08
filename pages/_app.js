import Favicon from '../components/Favicon';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Favicon />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
