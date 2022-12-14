import '../styles/globals.css';
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';

import type { AppProps } from 'next/app';
import Head from 'next/head';
function MyApp({ Component, pageProps: { ...pageProps } }: AppProps<{}>) {
  const currentPage = Component.name;
  return (
    <ThirdwebProvider
      desiredChainId={ChainId.Goerli}
      authConfig={{
        authUrl: '/api/auth',
        domain: 'localhost:3000',
      }}
    >
      <Head>
        <title>Lyra NFT Market Place</title>
        <link rel="icon" href="/public/favicon.ico" />
      </Head>

      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
