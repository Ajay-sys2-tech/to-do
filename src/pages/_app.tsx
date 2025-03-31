import { type AppType } from "next/app";
import { Geist } from "next/font/google";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const geist = Geist({
  subsets: ["latin"],
});

const MyApp: AppType = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <SessionProvider session={session}>
    <div className={geist.className}>
      <Component {...pageProps} />
    </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
