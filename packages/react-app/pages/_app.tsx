import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { celoAlfajores } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { ToastContainer } from "react-toastify";

import Layout from "../components/Layout";

const { chains, publicClient } = configureChains(
  [celoAlfajores],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "2b59a50447305d116602bfcbc02b5bd6",
  chains,
});
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <ToastContainer autoClose={15000} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
