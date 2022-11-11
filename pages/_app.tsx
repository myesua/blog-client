import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ContextProvider } from '../context/context';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ContextProvider
      value={{
        user: null,
        isFetching: false,
        error: false,
      }}>
      <Component {...pageProps} />
    </ContextProvider>
  );
}

export default MyApp;
